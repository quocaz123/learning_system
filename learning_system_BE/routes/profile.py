from utils.middleware import token_required, get_jwt_identity
from flask import Blueprint, jsonify, request, Flask
from models import db, Profile, User
from datetime import datetime

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['POST'])
@token_required()
def update_profile():
    current_user_id = get_jwt_identity()

    # Kiểm tra user tồn tại
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    # Lấy dữ liệu từ JSON
    full_name = data.get('full_name')
    phone = data.get('phone')
    birth_date_str = data.get('birth_date')
    avatar_url = data.get('avatar_url')
    bio = data.get('bio')

    # Chuyển birth_date sang kiểu datetime (nếu có)
    birth_date = None
    if birth_date_str:
        try:
            birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid birth_date format, use YYYY-MM-DD"}), 400

    # Nếu chưa có profile thì tạo mới
    if not user.profile:
        profile = Profile(
            user_id=current_user_id,
            full_name=full_name,
            phone=phone,
            birth_date=birth_date,
            avatar_url=avatar_url,
            bio=bio
        )
        db.session.add(profile)
    else:
        # Nếu đã có profile thì cập nhật
        profile = user.profile
        profile.full_name = full_name or profile.full_name
        profile.phone = phone or profile.phone
        profile.birth_date = birth_date or profile.birth_date
        profile.avatar_url = avatar_url or profile.avatar_url
        profile.bio = bio or profile.bio

    try:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500 
    

@profile_bp.route('/profile', methods=['GET'])
@token_required(allowed_roles=["student", "teacher"])
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "full_name": profile.full_name,
        "phone": profile.phone,
        "email": user.email,
        "birth_date": profile.birth_date.strftime("%d/%m/%Y") if profile.birth_date else None,
        "avatar_url": profile.avatar_url,
        "bio": profile.bio
    }), 200

@profile_bp.route('/2fa/toggle', methods=["POST"])
@token_required()
def toggle_2fa():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    enable_2fa = data.get("enable_2fa")

    if enable_2fa not in [True, False]:
         return jsonify({"error": "Invalid value for enable_2fa. Must be true or false"}), 400
    
    user.is_2fa_enabled = enable_2fa
    db.session.commit()

    return jsonify({
        "message": "2FA updated successfully",
        "2fa_enabled": user.is_2fa_enabled
    }), 200