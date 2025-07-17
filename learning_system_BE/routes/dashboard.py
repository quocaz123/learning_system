from flask import Blueprint, jsonify
from models.user import User
from models.course import Course
from models.assignment import Submission
from models.log import Log
from models.user import User, Profile
from sqlalchemy.orm import joinedload
from sqlalchemy import extract, func
from database import db
import datetime
from datetime import datetime, timezone
from utils.middleware import token_required

# Blueprint cho dashboard

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/summary', methods=['GET'])
@token_required('assistant')
def dashboard_summary():
    now = datetime.utcnow()
    this_month = now.month
    this_year = now.year
    # Tháng trước
    if this_month == 1:
        last_month = 12
        last_month_year = this_year - 1
    else:
        last_month = this_month - 1
        last_month_year = this_year

    # Tổng số người dùng
    total_users = db.session.query(func.count(User.user_id)).scalar() or 0
    last_month_users = db.session.query(func.count(User.user_id)).filter(
        extract('month', User.created_at) == last_month,
        extract('year', User.created_at) == last_month_year
    ).scalar() or 0
    this_month_users = db.session.query(func.count(User.user_id)).filter(
        extract('month', User.created_at) == this_month,
        extract('year', User.created_at) == this_year
    ).scalar() or 0
    users_percent = calc_percent(this_month_users, last_month_users)

    # Tổng số khóa học
    total_courses = db.session.query(func.count(Course.course_id)).scalar() or 0
    last_month_courses = db.session.query(func.count(Course.course_id)).filter(
        extract('month', Course.created_at) == last_month,
        extract('year', Course.created_at) == last_month_year
    ).scalar() or 0
    this_month_courses = db.session.query(func.count(Course.course_id)).filter(
        extract('month', Course.created_at) == this_month,
        extract('year', Course.created_at) == this_year
    ).scalar() or 0
    courses_percent = calc_percent(this_month_courses, last_month_courses)

    # Tổng số sinh viên hoạt động (có nộp bài trong tháng)
    active_students = db.session.query(Submission.user_id).filter(
        extract('month', Submission.submitted_at) == this_month,
        extract('year', Submission.submitted_at) == this_year
    ).distinct().count() or 0
    last_month_active_students = db.session.query(Submission.user_id).filter(
        extract('month', Submission.submitted_at) == last_month,
        extract('year', Submission.submitted_at) == last_month_year
    ).distinct().count() or 0
    students_percent = calc_percent(active_students, last_month_active_students)

    # Tổng số bài nộp
    total_submissions = db.session.query(func.count(Submission.submission_id)).scalar() or 0
    last_month_submissions = db.session.query(func.count(Submission.submission_id)).filter(
        extract('month', Submission.submitted_at) == last_month,
        extract('year', Submission.submitted_at) == last_month_year
    ).scalar() or 0
    this_month_submissions = db.session.query(func.count(Submission.submission_id)).filter(
        extract('month', Submission.submitted_at) == this_month,
        extract('year', Submission.submitted_at) == this_year
    ).scalar() or 0
    submissions_percent = calc_percent(this_month_submissions, last_month_submissions)

    return jsonify({
        "total_users": total_users,
        "users_percent": users_percent,
        "total_courses": total_courses,
        "courses_percent": courses_percent,
        "active_students": active_students,
        "students_percent": students_percent,
        "total_submissions": total_submissions,
        "submissions_percent": submissions_percent
    })

@dashboard_bp.route('/dashboard/recent-activities', methods=['GET'])
@token_required('assistant')
def dashboard_recent_activities():
    # Lấy 5 log mới nhất toàn hệ thống
    logs = (
        db.session.query(Log, User, Profile)
        .join(User, Log.user_id == User.user_id)
        .join(Profile, Profile.user_id == User.user_id)
        .order_by(Log.created_at.desc())
        .limit(5)
        .all()
    )
    result = []
    for log, user, profile in logs:
        # Xác định icon/type cho FE dựa vào action_type
        if log.action_type == 'submission':
            activity_type = 'submission'
        elif log.action_type == 'login':
            activity_type = 'login'
        elif log.action_type == 'lesson_completed':
            activity_type = 'completion'
        elif log.action_type == 'course_created':
            activity_type = 'course'
        else:
            activity_type = 'other'
        # Mô tả hành động
        if log.action_type == 'submission':
            action = f"Nộp bài tập {log.action_data.get('assignment_title', '')}" if log.action_data else "Nộp bài tập"
        elif log.action_type == 'login':
            action = "Đăng nhập hệ thống"
        elif log.action_type == 'lesson_completed':
            action = f"Hoàn thành bài học {log.action_data.get('lesson_title', '')}" if log.action_data else "Hoàn thành bài học"
        elif log.action_type == 'course_created':
            action = "Tạo khóa học mới"
        else:
            action = log.action_type
        # Tính thời gian tương đối
        now = datetime.now(timezone.utc)
        diff = now - log.created_at.replace(tzinfo=timezone.utc)
        if diff.days > 0:
            time_ago = f"{diff.days} ngày trước"
        elif diff.seconds >= 3600:
            time_ago = f"{diff.seconds // 3600} giờ trước"
        elif diff.seconds >= 60:
            time_ago = f"{diff.seconds // 60} phút trước"
        else:
            time_ago = "Vừa xong"
        result.append({
            "user": profile.full_name or user.email,
            "type": activity_type,
            "action": action,
            "time": time_ago
        })
    return jsonify(result), 200

def calc_percent(this_month, last_month):
    if last_month == 0:
        return 100 if this_month > 0 else 0
    return round((this_month - last_month) / last_month * 100, 2) 