from flask import Blueprint, jsonify, request, Flask, make_response
from services.auth_service import generate_token, decode_token
from utils.middleware import token_required, get_jwt_identity
from marshmallow import ValidationError
from models.user import User, UserCourse
from schemas.user_schema import UserRegisterSchema
from database import db
from werkzeug.security import generate_password_hash, check_password_hash
from services.otp_service import generate_otp, send_otp_email, verify_otp
from flask_redis import FlaskRedis
from dotenv import load_dotenv 
import os
import datetime
from models import Profile, Course, UserCourse, User, Lesson, Assignment, LessonProgress
from sqlalchemy import func, text
from models.log import Log
from models.reset_token import PasswordResetToken
from werkzeug.security import generate_password_hash
import secrets
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)
app.config['REDIS_URL'] = os.getenv("REDIS_URL")
redis_client = FlaskRedis(app)

bp = Blueprint('user', __name__)
profile_bp = Blueprint('profile', __name__)
course_user = Blueprint('course_user', __name__)

ALLOWED_ROLES = ['student', 'teacher']

def generate_reset_token():
    return secrets.token_urlsafe(32)

def send_reset_email(receiver_email, reset_url):
    from email.message import EmailMessage
    import smtplib
    from flask import current_app
    message = EmailMessage()
    message['Subject'] = 'Đặt lại mật khẩu'
    message['From'] = current_app.config['EMAIL_USER']
    message['To'] = receiver_email
    message.set_content(f"Nhấn vào liên kết sau để đặt lại mật khẩu: {reset_url}\nLiên kết này sẽ hết hạn sau 30 phút.")
    with smtplib.SMTP_SSL(current_app.config['EMAIL_HOST'], int(current_app.config['EMAIL_PORT'])) as smtp:
        smtp.login(current_app.config['EMAIL_USER'], current_app.config['EMAIL_PASS'])
        smtp.send_message(message)

@bp.route("/register", methods=["POST"])
def register():
    try:
        data = UserRegisterSchema().load(request.json)
    except ValidationError as err:
        return {"errors": err.messages}, 400
    return register_user(data)

def register_user(data):
    # Kiểm tra email đã tồn tại chưa
    if User.query.filter_by(email=data["email"]).first():
        return {"message": "Email đã tồn tại"}, 400

    # Kiểm tra role
    role = data.get("role", "student")
    if role not in ALLOWED_ROLES:
        return {"message": "Vai trò không khả dụng."}, 400

    # Tạo user mới
    user = User(
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        role=role
    )
    db.session.add(user)
    db.session.commit()  # Để user_id được sinh ra

    # Tạo profile mới
    profile = Profile(
        user_id=user.user_id,
        full_name=data.get("full_name", "")
    )
    db.session.add(profile)
    db.session.commit()

    return {"message": "Đăng ký thành công"}, 201

@bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    if user.is_2fa_enabled:
        otp = generate_otp(user.otp_secret)
        send_otp_email(user.email, otp)
        return jsonify({
            "message": "OTP sent to email",
            "need_2fa": True,
            "user_id": str(user.user_id)
        }), 200

    access_token, refresh_token = generate_token(user)

    # Tạo response và gán cookie
    response = make_response(jsonify({
        "access_token": access_token,
    }))
    response.set_cookie("refresh_token", refresh_token,  httponly=True, samesite='Lax', max_age=7*24*3600, path='/')
    return response, 200


@bp.route('/refresh', methods=['POST'])
def refresh():
    token = request.cookies.get("refresh_token")
    print("refresh_token from cookie:", token);
    if not token:
        return jsonify({"error": "Refresh token missing"}), 401

    payload = decode_token(token)
    if "error" in payload:
        return jsonify(payload), 401

    if payload.get("type") != "refresh":
        return jsonify({"error": "Không phải refresh token"}), 403

    user = User.query.get(payload.get("sub"))
    if not user:
        return jsonify({"error": "Không tìm thấy user"}), 404

    new_access_token, new_refresh_token = generate_token(user)

    response = make_response(jsonify({
        "access_token": new_access_token,
    }))
    response.set_cookie("refresh_token", new_refresh_token, httponly=True, samesite='Lax', secure=False, max_age=7*24*3600, path='/')
    return response


@bp.route("/verify-otp", methods=["POST"])
def verify_otp_route():
    data = request.json
    user = User.query.get(data["user_id"])

    if not user or not user.is_2fa_enabled:
        return jsonify({"message": "User not found or 2FA disabled"}), 400

    if not verify_otp(user.otp_secret, data["otp"]):
        return jsonify({"message": "Invalid OTP"}), 401
    
    access_token, refresh_token = generate_token(user)

    response = make_response(jsonify({
        "access_token": access_token,
    }))
    response.set_cookie("refresh_token", refresh_token, httponly=True, samesite='Strict', secure=True, max_age=7*24*3600)
    return response


@bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    data = request.json
    user_id = data.get("user_id")
    user = User.query.get(user_id)

    if not user or not user.is_2fa_enabled:
        return jsonify({"message": "User not found or 2FA not enabled"}), 400

    cooldown_key = f"otp_cooldown:{user_id}"
    limit_key = f"resend_otp_limit:{user_id}"

    # Kiểm tra cooldown
    if redis_client.get(cooldown_key):
        return jsonify({"message": "Please wait before resending OTP"}), 429

    # Đếm số lần gửi
    current = redis_client.get(limit_key)
    if current and int(current) >= 5:
        return jsonify({"message": "You have resent OTP too many times. Please try again later."}), 429

    # Tạo và gửi lại OTP
    otp = generate_otp(user.otp_secret)
    send_otp_email(user.email, otp)
    redis_client.incr(limit_key)
    redis_client.expire(limit_key, 600)

    return jsonify({"message": "OTP sent to email", "need_2fa": True, "user_id": str(user.user_id)})

@bp.route('/logout', methods=["POST"])
@token_required()
def logout():
    jti = request.user.get("jti")
    exp = request.user.get("exp")

    ttl = exp - int(datetime.datetime.utcnow().timestamp())
    redis_client.setex(f"blacklist:{jti}", ttl, "true")

    response = jsonify({"message": "Đăng xuất thành công (token đã bị vô hiệu hóa)"})
    response.delete_cookie("refresh_token")
    return response

@bp.route('/forgot-password', methods=["POST"])
def forgot_password():
    data = request.json
    email = data.get("email")
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu."}), 200
    # Sinh token và lưu vào DB
    token = generate_reset_token()
    expires_at = datetime.utcnow() + timedelta(minutes=30)
    reset_token = PasswordResetToken(user_id=user.user_id, token=token, expires_at=expires_at)
    db.session.add(reset_token)
    db.session.commit()
    # Gửi email
    reset_url = f"http://localhost:5173/reset-password?token={token}"
    send_reset_email(user.email, reset_url)
    return jsonify({"message": "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu."}), 200

@bp.route('/reset-password', methods=["POST"])
def reset_password():
    data = request.json
    token = data.get("token")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")
    if not token or not new_password or not confirm_password:
        return jsonify({"message": "Thiếu thông tin"}), 400
    if new_password != confirm_password:
        return jsonify({"message": "Mật khẩu xác nhận không khớp"}), 400
    reset_token = PasswordResetToken.query.filter_by(token=token).first()
    if not reset_token or reset_token.expires_at < datetime.utcnow():
        return jsonify({"message": "Token không hợp lệ hoặc đã hết hạn"}), 400
    user = User.query.get(reset_token.user_id)
    if not user:
        return jsonify({"message": "Người dùng không tồn tại"}), 404
    user.password_hash = generate_password_hash(new_password)
    db.session.delete(reset_token)
    db.session.commit()
    return jsonify({"message": "Đặt lại mật khẩu thành công"}), 200

@bp.route('/change-password', methods=["POST"])
@token_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    if not check_password_hash(user.password_hash, current_password):
        return jsonify({"message": "Current password is incorrect"}), 401

    if new_password != confirm_password:
        return jsonify({"message": "New passwords do not match"}), 400

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({
        "message": "Password changed successfully",
        "status" : 200
        })

@bp.route('/teacher/dashboard-stats', methods=["GET"])
@token_required(['teacher', 'assistant'])
def teacher_dashboard_stats():
    user_id = get_jwt_identity()
    # Tổng khóa học
    courses = Course.query.filter_by(created_by=user_id).all()
    course_ids = [c.course_id for c in courses]
    total_courses = len(courses)

    # Tổng sinh viên (unique)
    student_ids = set()
    for cid in course_ids:
        students = UserCourse.query.filter_by(course_id=cid).all()
        for s in students:
            # Kiểm tra role là student
            user = User.query.get(s.user_id)
            if user and user.role == 'student':
                student_ids.add(user.user_id)
    total_students = len(student_ids)

    # Tổng bài tập
    lessons = Lesson.query.filter(Lesson.course_id.in_(course_ids)).all()
    lesson_ids = [l.lesson_id for l in lessons]
    total_assignments = Assignment.query.filter(Assignment.lesson_id.in_(lesson_ids)).count()

    # Tỉ lệ hoàn thành trung bình
    # Với mỗi student, đếm số lesson đã hoàn thành / tổng lesson
    avg_completion = 0
    if total_students > 0 and len(lesson_ids) > 0:
        total_percent = 0
        for sid in student_ids:
            completed = LessonProgress.query.filter(
                LessonProgress.user_id == sid,
                LessonProgress.lesson_id.in_(lesson_ids),
                LessonProgress.completed == True
            ).count()
            percent = completed / len(lesson_ids) * 100
            total_percent += percent
        avg_completion = round(total_percent / total_students)
    
    result = {
        'total_courses': total_courses,
        'total_students': total_students,
        'total_assignments': total_assignments,
        'avg_completion': avg_completion
    }

    return jsonify({"data" : result, "status" : 200}), 200

@bp.route('/teacher/student-logs', methods=["GET"])
@token_required(['teacher', 'assistant'])
def get_student_logs():
    user_id = get_jwt_identity()
    # Lấy các course do teacher tạo
    courses = Course.query.filter_by(created_by=user_id).all()
    course_ids = [c.course_id for c in courses]
    # Lấy user_id của sinh viên thuộc các lớp này
    student_ids = set()
    for cid in course_ids:
        students = UserCourse.query.filter_by(course_id=cid).all()
        for s in students:
            user = User.query.get(s.user_id)
            if user and user.role == 'student':
                student_ids.add(user.user_id)
    # Lấy log của các sinh viên này
    logs = Log.query.filter(Log.user_id.in_(student_ids)).order_by(Log.created_at.desc()).limit(30).all()
    result = [
        {
            'log_id': log.log_id,
            'user_id': log.user_id,
            'action_type': log.action_type,
            'action_data': log.action_data,
            'created_at': log.created_at.isoformat()
        }
        for log in logs
    ]
    return jsonify({"data": result, "status": 200}), 200

@bp.route('/teacher/recent-submissions', methods=["GET"])
@token_required(['teacher', 'assistant'])
def get_recent_submissions():
    user_id = get_jwt_identity()
    # Lấy các course do teacher tạo
    courses = Course.query.filter_by(created_by=user_id).all()
    course_ids = [c.course_id for c in courses]
    # Lấy lesson_id thuộc các course này
    lessons = Lesson.query.filter(Lesson.course_id.in_(course_ids)).all()
    lesson_ids = [l.lesson_id for l in lessons]
    # Lấy assignment_id thuộc các lesson này
    assignments = Assignment.query.filter(Assignment.lesson_id.in_(lesson_ids)).all()
    assignment_ids = [a.assignment_id for a in assignments]
    # Lấy các bài nộp gần đây của sinh viên cho các assignment này
    submissions = db.session.execute(
        text('''
        SELECT s.submission_id, s.assignment_id, s.user_id, s.submitted_at, a.title as assignment_title, a.due_date, l.course_id, c.title as course_title
        FROM submissions s
        JOIN assignments a ON s.assignment_id = a.assignment_id
        JOIN lessons l ON a.lesson_id = l.lesson_id
        JOIN courses c ON l.course_id = c.course_id
        WHERE s.assignment_id IN :assignment_ids
        ORDER BY s.submitted_at DESC
        LIMIT 10
        '''), {"assignment_ids": tuple(assignment_ids) if assignment_ids else (0,)}
    ).fetchall()
    result = [
        {
            "assignment_title": row.assignment_title,
            "course_title": row.course_title,
            "due_date": row.due_date.isoformat() if row.due_date else None,
            "student_id": row.user_id,
            "submitted_at": row.submitted_at.isoformat() if row.submitted_at else None
        }
        for row in submissions
    ]
    return jsonify({"data": result, "status": 200}), 200

@course_user.route('/courses/<int:course_id>/enroll', methods=["POST"])
@token_required(['student'])
def enroll_course(course_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Kiểm tra xem người dùng đã đăng ký khóa học chưa
    existing = UserCourse.query.filter_by(user_id=user_id, course_id=course_id).first()
    if existing:
        return jsonify({"message": "Already enrolled in this course."}), 200

    # Thêm khóa học vào danh sách đăng ký của người dùng
    enrollment = UserCourse(user_id=user_id, course_id=course_id, enrolled_at=datetime.utcnow())
    db.session.add(enrollment)
    db.session.commit()

    return jsonify({"message": "Successfully enrolled in the course", "status" : 200}), 200


@course_user.route('/courses/<int:course_id>/unenroll', methods=['DELETE'])
@token_required(['student'])
def unenroll_course(course_id):
    user_id = get_jwt_identity()
    

    # Kiểm tra user đã đăng ký chưa
    enrollment = UserCourse.query.filter_by(user_id=user_id, course_id=course_id).first()
    if not enrollment:
        return jsonify({"error": "You are not enrolled in this course."}), 404

    # Xóa bản ghi đăng ký
    db.session.delete(enrollment)
    db.session.commit()

    return jsonify({"message": "Unenrolled from course successfully.", "status" : 200}), 200
