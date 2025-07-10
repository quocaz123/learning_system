from flask import Blueprint, jsonify, request
from utils.middleware import token_required, get_jwt_identity
from sqlalchemy import func
from services.assignment_service import (
    create_assignment as create_assignment_service,
    update_assignment as update_assignment_service,
    get_assignments as get_assignments_service,
    delete_assigment as delete_assignment_service,
)
from models import UserCourse, Lesson, Assignment, AssignmentQuizQuestion, Submission

assignment_bp = Blueprint('assignment', __name__)

@assignment_bp.route('/assignments', methods=['GET'])
@token_required(['teacher', 'admin'])
def get_assignments():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    try:
        result = get_assignments_service(page, per_page)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@assignment_bp.route('/assignments', methods=['POST'])
#@token_required(['teacher', 'admin'])
def create_assignment():
    try:
        data = request.get_json()
        assignment = create_assignment_service(data)
        return jsonify({"message": "Assignment created successfully", "assignment_id": assignment.assignment_id , "status" : 201}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@assignment_bp.route('/assignments/<int:assignment_id>', methods=['PUT'])
#@token_required(['teacher', 'admin'])
def update_assignment(assignment_id):
    data = request.get_json()
    try:
        assignment = update_assignment_service(assignment_id, data)
        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404
        return jsonify({"message": "Assignment updated successfully", "assignment_id": assignment.assignment_id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@assignment_bp.route('/assignments/<int:assignment_id>', methods=['DELETE'])
#@token_required(['teacher', 'admin'])
def delete_assignment(assignment_id):
    try:
        assignment = delete_assignment_service(assignment_id)
        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404
        return jsonify({"message": "Assignment deleted successfully", "assignment_id": assignment_id, "status" : 200}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@assignment_bp.route('/my-assignments', methods=['GET'])
@token_required()
def get_my_assignments():
    user_id = get_jwt_identity()

    # 1. Lấy danh sách course_id mà user đã đăng ký
    enrolled_courses = UserCourse.query.filter_by(user_id=user_id).all()
    course_ids = [ec.course_id for ec in enrolled_courses]

    if not course_ids:
        return jsonify({"assignments": [], "message": "No enrolled courses."}), 200

    # 2. Lấy danh sách lesson_id thuộc các course đó
    lessons = Lesson.query.filter(Lesson.course_id.in_(course_ids)).all()
    lesson_ids = [lesson.lesson_id for lesson in lessons]

    if not lesson_ids:
        return jsonify({"assignments": [], "message": "No lessons found."}), 200

    # 3. Lấy các assignments thuộc các lesson đó
    assignments = Assignment.query.filter(Assignment.lesson_id.in_(lesson_ids)).all()

    # 4. Format dữ liệu trả về
    result = []
    for a in assignments:
        assignment_data = {
            "assignment_id": a.assignment_id,
            "title": a.title,
            "description": a.description,
            "type": a.type,
            "due_date": a.due_date.strftime('%Y-%m-%d') if a.due_date else None,
            "lesson_id": a.lesson_id,
            "created_at": a.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        # Kiểm tra trạng thái nộp bài của user
        submission = Submission.query.filter_by(assignment_id=a.assignment_id, user_id=user_id).first()
        if submission and submission.status == 'submitted':
            assignment_data['status'] = 'submitted'
        else:
            assignment_data['status'] = 'pending'
        if a.type == 'quiz':
            questions = AssignmentQuizQuestion.query.filter_by(assignment_id=a.assignment_id).all()
            assignment_data["questions"] = [
                {
                    "id": q.question_id,
                    "question": q.question_text,
                    "options": q.options
                }
                for q in questions
            ]
        result.append(assignment_data)

    return jsonify({"assignments": result}), 200


@assignment_bp.route('/assignments/<int:assignment_id>/submit', methods=['POST'])
@token_required()
def submit_assignment(assignment_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    from models import Submission
    from database import db
    code = data.get('code')
    file_url = data.get('file_url')
    quiz_answers = data.get('quiz_answers')

    submission = Submission.query.filter_by(assignment_id=assignment_id, user_id=user_id).first()
    if not submission:
        submission = Submission(
            assignment_id=assignment_id,
            user_id=user_id,
            code=code,
            file_url=file_url,
            quiz_answers=quiz_answers,
            status='submitted'
        )
        db.session.add(submission)
    else:
        submission.code = code
        submission.file_url = file_url
        submission.quiz_answers = quiz_answers
        submission.status = 'submitted'
    db.session.commit()
    return jsonify({"success": True, "message": "Nộp bài thành công!"})