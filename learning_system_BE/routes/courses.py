from flask import Blueprint, jsonify, request
from utils.middleware import token_required, get_jwt_identity
from models import User, Course, Lesson , UserCourse, LessonProgress
from services.course_service import count_completed_lessons, get_all_courses_service, get_lesson_detail_service, create_course_service, create_lesson_service
from models import assignment
import logging
from models.log import Log
from database import db
import datetime

course_bp = Blueprint('course', __name__)
lesson_bp = Blueprint('lesson', __name__)

@course_bp.route('/create-course', methods=['POST'])
@token_required()
def create_course():
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "User not found"}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        title = data.get('title')
        if not title or not title.strip():
            return jsonify({"error": "Course title is required"}), 400
        
        description = data.get('description', '')
        language = data.get('language', 'other')
        
        # Create course using service
        result = create_course_service(
            user_id=user_id,
            title=title.strip(),
            description=description.strip(),
            language=language
        )
        
        if result.get('success'):
            # Log the action
            log = Log(
                user_id=user_id, 
                action_type='course_created', 
                action_data={'course_id': result.get('course_id'), 'title': title}
            )
            db.session.add(log)
            db.session.commit()
            
            return jsonify({
                "message": "Course created successfully",
                "data": result.get('data'),
                "status": 201
            }), 201
        else:
            return jsonify({"error": result.get('error')}), 400
            
    except Exception as e:
        logging.error(f"Error creating course: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

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
            "title": lesson.title,
            "created_at": lesson.created_at.strftime('%Y-%m-%d %H:%M:%S') if lesson.created_at else None
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

@course_bp.route('/courses/<int:course_id>/students', methods=['GET'])
@token_required(['teacher', 'assistant'])
def get_students_in_course(course_id):
    students = UserCourse.query.filter_by(course_id=course_id).all()
    result = []
    for s in students:
        user = User.query.get(s.user_id)
        if user and user.role == 'student':
            profile = user.profile
            result.append({
                'user_id': user.user_id,
                'full_name': profile.full_name if profile else '',
                'email': user.email,
            })
    return jsonify({'students': result, 'status': 200}), 200

@lesson_bp.route('/lessons/<int:lesson_id>', methods=['GET'])
@token_required()
def get_lesson_detail(lesson_id):
    lesson_data = get_lesson_detail_service(lesson_id)
    if not lesson_data:
        return jsonify({"error": "Lesson not found"}), 404
    return jsonify({"data": lesson_data, "status": 200})

@lesson_bp.route('/lessons/<int:lesson_id>', methods=['DELETE'])
@token_required(['teacher', 'assistant'])
def delete_lesson(lesson_id):
    from models.course import LessonAttachment, LessonCodeBlock, LessonVideo
    from models.assignment import Assignment
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404
    # Xóa các bản ghi liên quan
    LessonAttachment.query.filter_by(lesson_id=lesson_id).delete()
    LessonCodeBlock.query.filter_by(lesson_id=lesson_id).delete()
    LessonVideo.query.filter_by(lesson_id=lesson_id).delete()
    Assignment.query.filter_by(lesson_id=lesson_id).delete()
    db.session.delete(lesson)
    db.session.commit()
    return jsonify({"message": "Lesson deleted successfully", "lesson_id": lesson_id, "status": 200}), 200

@course_bp.route('/courses/<int:course_id>', methods=['DELETE'])
@token_required(['teacher', 'assistant'])
def delete_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404
    # Xóa các bản ghi liên quan
    Lesson.query.filter_by(course_id=course_id).delete()
    UserCourse.query.filter_by(course_id=course_id).delete()
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted successfully", "course_id": course_id, "status": 200}), 200

@course_bp.route('/all_courses', methods=['GET'])
@token_required()
def get_all_courses():
    user_id = get_jwt_identity()
    courses = Course.query.filter_by(created_by=user_id).all()
    results = []
    for course in courses:
        # Đếm số sinh viên
        students_count = UserCourse.query.filter_by(course_id=course.course_id).count()
        # Đếm số bài học
        lessons_count = Lesson.query.filter_by(course_id=course.course_id).count()
        # Đếm số bài tập (assignment) thuộc các bài học của course này
        lesson_ids = [l.lesson_id for l in Lesson.query.filter_by(course_id=course.course_id).all()]
        assignments_count = 0
        if lesson_ids:
            from models.assignment import Assignment
            assignments_count = Assignment.query.filter(Assignment.lesson_id.in_(lesson_ids)).count()
       
        results.append({
            "id": course.course_id,
            "name": course.title,
            "students": students_count,
            "lessons": lessons_count,
            "assignments": assignments_count
        })
    return jsonify({"data": results, "status": 200})

@course_bp.route('/courses/<int:course_id>', methods=['PUT'])
@token_required(['teacher', 'assistant'])
def update_course(course_id):
    from services.course_service import update_course_service
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    result = update_course_service(course_id, data)
    if result.get('success'):
        return jsonify({
            "message": "Course updated successfully",
            "data": result.get('data'),
            "status": 200
        }), 200
    else:
        return jsonify({"error": result.get('error')}), 400

@lesson_bp.route('/create-lesson', methods=['POST'])
@token_required()
def create_lesson():
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "User not found"}), 404
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        course_id = data.get('course_id')
        title = data.get('title')
        content_html = data.get('content_html', '')
        code_blocks = data.get('code_blocks', [])
        videos = data.get('videos', [])
        attachments = data.get('attachments', [])
        result = create_lesson_service(
            user_id=user_id,
            course_id=course_id,
            title=title,
            content_html=content_html,
            code_blocks=code_blocks,
            videos=videos,
            attachments=attachments
        )
        if result.get('success'):
            return jsonify({
                "message": "Lesson created successfully",
                "data": result.get('data'),
                "status": 201
            }), 201
        else:
            return jsonify({"error": result.get('error')}), 400
    except Exception as e:
        logging.error(f"Error creating lesson: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@lesson_bp.route('/lessons/complete', methods=['POST'])
@token_required()
def complete_lesson():
    from database import db
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
        db.session.add(progress)
    db.session.commit()
    # Ghi log
    lesson = Lesson.query.get(lesson_id)
    log = Log(user_id=user_id, action_type='lesson_completed', action_data={'lesson_id': lesson_id, 'lesson_title': lesson.title})
    db.session.add(log)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Đã hoàn thành bài học!'})

@lesson_bp.route('/lessons/<int:lesson_id>', methods=['PUT'])
@token_required(['teacher', 'assistant'])
def update_lesson(lesson_id):
    from services.course_service import update_lesson_service  # Sửa lại import đúng file
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    result = update_lesson_service(lesson_id, data)
    if result.get('success'):
        return jsonify({
            "message": "Lesson updated successfully",
            "data": result.get('data'),
            "status": 200
        }), 200
    else:
        return jsonify({"error": result.get('error')}), 400

@course_bp.route('/all-courses', methods=['GET'])
@token_required()
def get_all_course():
    user_id = get_jwt_identity()
    results = get_all_courses_service(user_id)
    return jsonify({"data": results, "status": 200}), 200

