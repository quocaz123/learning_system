from flask import Blueprint, jsonify, request
from utils.middleware import token_required, get_jwt_identity
from models import User, Course, Lesson , UserCourse, LessonProgress
from services.course_service import count_completed_lessons, get_all_courses_service, get_lesson_detail_service
from models import assignment
import logging
from models.log import Log
from database import db
import datetime

course_bp = Blueprint('course', __name__)
lesson_bp = Blueprint('lesson', __name__)

@course_bp.route('/courses', methods=['GET'])
@token_required()
def get_courses():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"message": "User not found"}), 404
    courses = Course.query.filter_by(created_by=user_id).all()

    result = []
    for course in courses:
        result.append({
            "course_id": course.course_id,
            "title": course.title
        })

    return jsonify({"result": result, "status": 200}), 200

@course_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    lessons = Lesson.query.filter_by(course_id=course_id).all()
    
    result = []
    for lesson in lessons:
        result.append({
            "lesson_id": lesson.lesson_id,
            "title": lesson.title
        })

    return jsonify({"result": result, "status": 200}), 200
    
@course_bp.route('/my-courses', methods=['GET'])
@token_required()
def get_my_courses():
    user_id = get_jwt_identity()
    user_courses = UserCourse.query.filter_by(user_id=user_id).all()

    result = []
    for uc in user_courses:
        course = Course.query.get(uc.course_id)
        lessons = Lesson.query.filter_by(course_id=course.course_id).all()
        lesson_list = []
        for l in lessons:
            # Kiểm tra trạng thái hoàn thành
            progress = LessonProgress.query.filter_by(user_id=user_id, lesson_id=l.lesson_id).first()
            lesson_list.append({
                "lesson_id": l.lesson_id,
                "title": l.title,
                "completed": bool(progress and progress.completed)
            })
        result.append({
            "course_id": course.course_id,
            "title": course.title,
            "description": course.description,
            "language": course.language,
            "lessons": lesson_list
        })

    return jsonify({"data": result, "status": 200}), 200

@lesson_bp.route('/lessons/<int:lesson_id>', methods=['GET'])
@token_required()
def get_lesson_detail(lesson_id):
    lesson_data = get_lesson_detail_service(lesson_id)
    if not lesson_data:
        return jsonify({"error": "Lesson not found"}), 404
    return jsonify({"data": lesson_data, "status": 200})

@course_bp.route('/all_courses', methods=['GET'])
@token_required()
def get_all_courses():
    user_id = get_jwt_identity()
    results = get_all_courses_service(user_id)
    return jsonify({"data": results, "status": 200})


@lesson_bp.route('/lessons/complete', methods=['POST'])
@token_required()
def complete_lesson():
    data = request.get_json()
    user_id = data.get('user_id') or get_jwt_identity()
    lesson_id = data.get('lesson_id')
    course_id = data.get('course_id')
    if not user_id or not lesson_id or not course_id:
        return jsonify({'error': 'Thiếu thông tin'}), 400
    progress = LessonProgress.query.filter_by(user_id=user_id, lesson_id=lesson_id).first()
    from datetime import datetime
    if progress:
        progress.completed = True
        progress.completed_at = datetime.utcnow()
    else:
        progress = LessonProgress(user_id=user_id, lesson_id=lesson_id, completed=True, completed_at=datetime.utcnow())
        from database import db
        db.session.add(progress)
    db.session.commit()
    # Ghi log
    lesson = Lesson.query.get(lesson_id)
    log = Log(user_id=user_id, action_type='lesson_completed', action_data={'lesson_id': lesson_id, 'lesson_title': lesson.title})
    db.session.add(log)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Đã hoàn thành bài học!'})

