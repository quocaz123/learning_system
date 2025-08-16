from flask import Blueprint, jsonify, request
from models.user import User, Profile
from database import db
from utils.middleware import token_required

def user_to_dict(user, profile):
    return {
        "id": user.user_id,
        "fullName": profile.full_name if profile else user.email,
        "email": user.email,
        "role": user.role,
        "status": "active" if user.is_active else "inactive",
    }

adminuser_bp = Blueprint('adminuser', __name__)

@adminuser_bp.route('/admin/users', methods=['GET'])
@token_required('assistant')
def get_all_users():
    users = User.query.all()
    profiles = {p.user_id: p for p in Profile.query.all()}
    data = [user_to_dict(u, profiles.get(u.user_id)) for u in users]
    return jsonify(data), 200

@adminuser_bp.route('/admin/users', methods=['POST'])
@token_required('assistant')
def add_user():
    data = request.json
    user = User(
        email=data['email'],
        role=data.get('role', 'student'),
        is_active=(data.get('status', 'active') == 'active'),
        password_hash='pbkdf2:sha256:123456'  # default password, nên sửa lại cho thực tế
    )
    db.session.add(user)
    db.session.commit()
    profile = Profile(user_id=user.user_id, full_name=data.get('fullName', ''))
    db.session.add(profile)
    db.session.commit()
    return jsonify(user_to_dict(user, profile)), 201

@adminuser_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
@token_required('assistant')
def update_user(user_id):
    data = request.json
    user = User.query.get_or_404(user_id)
    profile = Profile.query.filter_by(user_id=user_id).first()
    user.email = data['email']
    user.role = data.get('role', user.role)
    user.is_active = (data.get('status', 'active') == 'active')
    if profile:
        profile.full_name = data.get('fullName', profile.full_name)
    db.session.commit()
    return jsonify(user_to_dict(user, profile)), 200

@adminuser_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@token_required('assistant')
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    profile = Profile.query.filter_by(user_id=user_id).first()
    if profile:
        db.session.delete(profile)
    db.session.delete(user)
    db.session.commit()
    return '', 204 

@adminuser_bp.route('/admin/courses', methods=['GET'])
@token_required('assistant')
def get_courses_admin():
    from models.course import Course
    from models.user import User
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    query = Course.query
    total = query.count()
    courses = query.order_by(Course.created_at.desc()).offset((page-1)*per_page).limit(per_page).all()
    result = []
    for course in courses:
        creator = User.query.get(course.created_by)
        profile = creator.profile if creator else None
        lessons_count = len(course.lessons) if hasattr(course, 'lessons') else 0
        result.append({
            "id": course.course_id,
            "name": course.title,
            "creator": profile.full_name if profile else (creator.email if creator else ""),
            "creator_email": creator.email if creator else "",
            "created_at": course.created_at.strftime('%Y-%m-%d %H:%M:%S') if course.created_at else "",
            "lessons_count": lessons_count
        })
    return jsonify({
        "courses": result,
        "total": total,
        "page": page,
        "per_page": per_page
    }) 