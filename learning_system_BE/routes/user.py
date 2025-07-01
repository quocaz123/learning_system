from flask import Blueprint, jsonify, request, Flask, make_response
from services.auth_service import generate_token, decode_token
from utils.middleware import token_required, get_jwt_identity
from marshmallow import ValidationError
from models.user import User
from schemas.user_schema import UserRegisterSchema
from database import db
from werkzeug.security import generate_password_hash, check_password_hash
from services.otp_service import generate_otp, send_otp_email, verify_otp
from flask_redis import FlaskRedis
from dotenv import load_dotenv 
import os
import datetime
from models import Profile

load_dotenv()

app = Flask(__name__)
app.config['REDIS_URL'] = os.getenv("REDIS_URL")
redis_client = FlaskRedis(app)

bp = Blueprint('user', __name__)
profile_bp = Blueprint('profile', __name__)

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

    # Tạo user mới
    user = User(
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        role=data.get("role", "student")
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
    response.set_cookie("refresh_token", refresh_token, httponly=True, samesite='Strict', secure=True, max_age=7*24*3600)
    return response, 200


@bp.route('/refresh', methods=['POST'])
def refresh():
    token = request.cookies.get("refresh_token")
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
    response.set_cookie("refresh_token", new_refresh_token, httponly=True, samesite='Strict', secure=True, max_age=7*24*3600)
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