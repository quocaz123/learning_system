from datetime import datetime
from models import Assignment, db, AssignmentCodeTest, AssignmentQuizQuestion, course
from flask import Blueprint, jsonify, request
from utils.middleware import token_required, get_jwt_identity

assignment_bp = Blueprint('assignment', __name__)

@assignment_bp.route('/assignments', methods=['POST'])
#@token_required(['teacher', 'admin'])
def create_assignment():
   # current_user_id = get_jwt_identity()
    data = request.get_json()

    try:
        assignment = Assignment(
            lesson_id=data['lesson_id'],
            title=data['title'],
            type=data['type'],
            description=data.get('description', ''),
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d') if 'due_date' in data else None,
        )
        db.session.add(assignment)
        db.session.commit()

        # Thêm test case nếu có
        if data['type'] in ['code', 'mixed']:
            for test in data.get('code_tests', []):
                code_test = AssignmentCodeTest(
                    assignment_id=assignment.assignment_id,
                    input_data=test['input_data'],
                    expected_output=test['expected_output'],
                    score_weight=test.get('score_weight', 1.0)
                )
                db.session.add(code_test)

        # Thêm câu hỏi quiz nếu có
        if data['type'] in ['quiz', 'mixed']:
            for q in data.get('quiz_questions', []):
                quiz_question = AssignmentQuizQuestion(
                    assignment_id=assignment.assignment_id,
                    question_text=q['question_text'],
                    options=q.get('options', []),
                    correct_index=q.get('correct_index', 0),
                    score_weight=q.get('score_weight', 1.0)
                )
                db.session.add(quiz_question)

        db.session.commit()

        return jsonify({"message": "Assignment created successfully", "assignment_id": assignment.assignment_id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@assignment_bp.route('/assignments/<int:assignment_id>', methods=['PUT'])
#@token_required(['teacher', 'admin'])
def update_assignment(assignment_id):
    data = request.get_json()
    try:
        assignment = Assignment.query.get(assignment_id)
        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404

        # Cập nhật các trường cơ bản
        assignment.lesson_id = data.get('lesson_id', assignment.lesson_id)
        assignment.title = data.get('title', assignment.title)
        assignment.type = data.get('type', assignment.type)
        assignment.description = data.get('description', assignment.description)
        if 'due_date' in data:
            assignment.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d')

        # --- Xử lý code_tests ---
        if assignment.type in ['code', 'mixed'] and 'code_tests' in data:
            # Lấy danh sách test_id từ request
            req_tests = data.get('code_tests', [])
            req_test_ids = set([t.get('test_id') for t in req_tests if t.get('test_id') is not None])
            # Lấy danh sách test_id hiện tại trong DB
            db_tests = AssignmentCodeTest.query.filter_by(assignment_id=assignment.assignment_id).all()
            db_test_ids = set([t.test_id for t in db_tests])

            # Xóa test không còn trong request
            for db_test in db_tests:
                if db_test.test_id not in req_test_ids:
                    db.session.delete(db_test)

            # Thêm mới hoặc update
            for test in req_tests:
                if test.get('test_id') in db_test_ids:
                    # Update
                    db_test = next((t for t in db_tests if t.test_id == test['test_id']), None)
                    if db_test:
                        db_test.input_data = test['input_data']
                        db_test.expected_output = test['expected_output']
                        db_test.score_weight = test.get('score_weight', 1.0)
                else:
                    # Thêm mới
                    code_test = AssignmentCodeTest(
                        assignment_id=assignment.assignment_id,
                        input_data=test['input_data'],
                        expected_output=test['expected_output'],
                        score_weight=test.get('score_weight', 1.0)
                    )
                    db.session.add(code_test)
        elif assignment.type not in ['code', 'mixed']:
            AssignmentCodeTest.query.filter_by(assignment_id=assignment.assignment_id).delete()

        # --- Xử lý quiz_questions ---
        if assignment.type in ['quiz', 'mixed'] and 'quiz_questions' in data:
            req_questions = data.get('quiz_questions', [])
            req_question_ids = set([q.get('question_id') for q in req_questions if q.get('question_id') is not None])
            db_questions = AssignmentQuizQuestion.query.filter_by(assignment_id=assignment.assignment_id).all()
            db_question_ids = set([q.question_id for q in db_questions])

            # Xóa question không còn trong request
            for db_q in db_questions:
                if db_q.question_id not in req_question_ids:
                    db.session.delete(db_q)

            # Thêm mới hoặc update
            for q in req_questions:
                if q.get('question_id') in db_question_ids:
                    # Update
                    db_q = next((qq for qq in db_questions if qq.question_id == q['question_id']), None)
                    if db_q:
                        db_q.question_text = q['question_text']
                        db_q.options = q.get('options', [])
                        db_q.correct_index = q.get('correct_index', 0)
                        db_q.score_weight = q.get('score_weight', 1.0)
                else:
                    # Thêm mới
                    quiz_question = AssignmentQuizQuestion(
                        assignment_id=assignment.assignment_id,
                        question_text=q['question_text'],
                        options=q.get('options', []),
                        correct_index=q.get('correct_index', 0),
                        score_weight=q.get('score_weight', 1.0)
                    )
                    db.session.add(quiz_question)
        elif assignment.type not in ['quiz', 'mixed']:
            AssignmentQuizQuestion.query.filter_by(assignment_id=assignment.assignment_id).delete()

        db.session.commit()
        return jsonify({"message": "Assignment updated successfully", "assignment_id": assignment.assignment_id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500