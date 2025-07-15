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
from models.log import Log
from database import db
from datetime import datetime
from models import AssignmentCodeTest, Grade
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'docx', 'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

assignment_bp = Blueprint('assignment', __name__)

@assignment_bp.route('/assignments', methods=['GET'])
@token_required(['teacher', 'assistant'])
def get_assignments():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    try:
        result = get_assignments_service(page, per_page)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@assignment_bp.route('/assignments', methods=['POST'])
#@token_required(['teacher', 'assistant'])
def create_assignment():
    try:
        data = request.get_json()
        assignment = create_assignment_service(data)
        return jsonify({"message": "Assignment created successfully", "assignment_id": assignment.assignment_id , "status" : 201}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@assignment_bp.route('/assignments/<int:assignment_id>', methods=['PUT'])
@token_required(['teacher', 'assistant'])
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
@token_required(['teacher', 'assistant'])
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
            status='submitted',
            submitted_at=datetime.utcnow()
        )
        db.session.add(submission)
        db.session.commit()
    else:
        submission.code = code
        submission.file_url = file_url
        submission.quiz_answers = quiz_answers
        submission.status = 'submitted'
        submission.submitted_at = datetime.utcnow()
        db.session.commit()

    # Chấm điểm
    assignment = Assignment.query.get(assignment_id)
    score = 0
    max_score = 0
    if assignment.type == 'code':
        testcases = AssignmentCodeTest.query.filter_by(assignment_id=assignment_id).all()
        passed = 0
        for tc in testcases:
            # TODO: Thay bằng hàm chấm code thực tế
            actual_output = tc.expected_output
            if str(actual_output).strip() == str(tc.expected_output).strip():
                passed += 1
        max_score = len(testcases)
        score = passed
    elif assignment.type == 'quiz':
        questions = AssignmentQuizQuestion.query.filter_by(assignment_id=assignment_id).all()
        correct = 0
        for q in questions:
            answer = None
            if isinstance(quiz_answers, dict):
                answer = quiz_answers.get(str(q.quecóstion_id))
                if answer is None:
                    answer = quiz_answers.get(q.question_id)
            elif isinstance(quiz_answers, list):
                pass
            # So sánh với correct_index + 1
            if answer == q.correct_index:
                correct += 1
        max_score = len(questions)
        score = correct
    else:
        score = None
        max_score = None

    # Lưu điểm vào Grade
    grade = Grade.query.filter_by(submission_id=submission.submission_id).first()
    if grade:
        grade.score = score
        grade.graded_at = datetime.utcnow()
    else:
        grade = Grade(submission_id=submission.submission_id, score=score, graded_at=datetime.utcnow())
        db.session.add(grade)
    db.session.commit()

    # Ghi log
    log = Log(user_id=user_id, action_type='assignment_submitted', action_data={'assignment_id': assignment_id, 'assignment_title': assignment.title, 'score': score})
    db.session.add(log)
    db.session.commit()
    return jsonify({"success": True, "message": "Nộp bài thành công!", "score": score, "max_score": max_score})

@assignment_bp.route('/my-assignments/statistics', methods=['GET'])
@token_required()
def get_my_assignments_statistics():
    user_id = get_jwt_identity()
    submissions = Submission.query.filter_by(user_id=user_id).all()
    submitted_count = 0
    grading_count = 0
    for sub in submissions:
        if sub.status == 'submitted':
            submitted_count += 1
            if not sub.grade:
                grading_count += 1
    return jsonify({
        "submitted_count": submitted_count,
        "grading_count": grading_count
    }), 200

@assignment_bp.route('/assignments/<int:assignment_id>/testcases', methods=['GET'])
@token_required()
def get_assignment_testcases(assignment_id):
    """API trả về toàn bộ testcase của một assignment (dạng code)."""
    testcases = AssignmentCodeTest.query.filter_by(assignment_id=assignment_id).all()
    result = [
        {
            'test_id': tc.test_id,
            'input_data': tc.input_data,
            'expected_output': tc.expected_output,
            'score_weight': tc.score_weight
        }
        for tc in testcases
    ]
    return jsonify({'testcases': result, 'status': 200}), 200

@assignment_bp.route('/assignments/<int:assignment_id>/test-run', methods=['POST'])
@token_required()
def test_run_assignment(assignment_id):
    data = request.get_json()
    code = data.get('code')
    if not code:
        return jsonify({'error': 'Thiếu code'}), 400

    # Lấy toàn bộ testcase cho assignment này
    testcases = AssignmentCodeTest.query.filter_by(assignment_id=assignment_id).all()
    results = []
    # Giả lập kết quả: luôn trả về output giống expected_output (bạn cần thay bằng engine thực tế)
    for tc in testcases:
        actual_output = tc.expected_output  # TODO: Thay bằng hàm chấm code thực tế
        results.append({
            'input': tc.input_data,
            'expected_output': tc.expected_output,
            'actual_output': actual_output,
            'passed': str(actual_output).strip() == str(tc.expected_output).strip()
        })
    return jsonify(results), 200

@assignment_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        file_url = f'/uploads/{filename}'
        return jsonify({'file_url': file_url}), 200
    return jsonify({'error': 'File type not allowed'}), 400