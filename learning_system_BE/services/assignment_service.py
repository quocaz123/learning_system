from models import Assignment, AssignmentCodeTest, AssignmentQuizQuestion, db, Course, Submission, Lesson, User, UserCourse
from datetime import datetime
from sqlalchemy import func

def get_student_count_by_course(course_id):
    """
    Trả về số lượng học sinh đã đăng ký khóa học. Dùng bảng trung gian UserCourse
    """
    count = db.session.query(UserCourse).join(User, User.user_id == UserCourse.user_id) \
        .filter(UserCourse.course_id == course_id, User.role == 'student').count()
    return count

def get_assignments(page, per_page, teacher_id=None):
    # Base query
    query = (
        db.session.query(
            Assignment.assignment_id,
            Assignment.title,
            Assignment.due_date,
            Course.title.label('course_title'),
            Course.course_id.label('course_id'),
            func.count(Submission.submission_id).label('submission_count'),
        )
        .join(Lesson, Assignment.lesson_id == Lesson.lesson_id)
        .join(Course, Lesson.course_id == Course.course_id)
        .outerjoin(Submission, Submission.assignment_id == Assignment.assignment_id)
    )

    # Apply filter if teacher_id is provided
    if teacher_id:
        query = query.filter(Course.created_by == teacher_id)

    # Apply grouping and ordering
    query = query.group_by(
        Assignment.assignment_id,
        Assignment.title,
        Assignment.due_date,
        Course.title,
        Course.course_id
    ).order_by(Assignment.due_date.desc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    result = []
    for item in pagination.items:
        result.append({
            'assignment_id': item.assignment_id,
            'title': item.title,
            'course_name': item.course_title,
            'due_date': item.due_date.strftime('%Y-%m-%d') if item.due_date else None,
            'submitted': item.submission_count or 0,
            'total_students': get_student_count_by_course(item.course_id)
        })

    return {
        "page": page,
        "per_page": per_page,
        "total": pagination.total,
        "pages": pagination.pages,
        "assignments": result,
        "status": 200,
    }

def create_assignment(data):
    """
    Tạo mới một assignment với các thông tin cơ bản và các test/quiz liên quan.
    """
    assignment = Assignment(
        lesson_id=data['lesson_id'],
        type=data['type'],
        title=data['title'],
        description=data.get('description', ''),
        due_date=datetime.strptime(data['due_date'], '%Y-%m-%d') if 'due_date' in data else None
    )
    db.session.add(assignment)
    db.session.commit()  # Commit để assignment_id được sinh ra

    # Xử lý code_tests nếu có
    if assignment.type in ['code', 'mixed'] and 'code_tests' in data:
        for test in data['code_tests']:
            code_test = AssignmentCodeTest(
                assignment_id=assignment.assignment_id,
                input_data=test['input_data'],
                expected_output=test['expected_output'],
                score_weight=test.get('score_weight', 1.0)
            )
            db.session.add(code_test)

    # Xử lý quiz_questions nếu có
    if assignment.type in ['quiz', 'mixed'] and 'quiz_questions' in data:
        for question in data['quiz_questions']:
            quiz_question = AssignmentQuizQuestion(
                assignment_id=assignment.assignment_id,
                question_text=question['question_text'],
                options=question['options'],
                correct_index=question['correct_index'],
                score_weight=question.get('score_weight', 1.0)
            )
            db.session.add(quiz_question)

    db.session.commit()
    return assignment

def update_assignment(assignment_id, data):
    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return None
    assignment.lesson_id = data.get('lesson_id', assignment.lesson_id)
    assignment.title = data.get('title', assignment.title)
    assignment.type = data.get('type', assignment.type)
    assignment.description = data.get('description', assignment.description)
    if 'due_date' in data:
        assignment.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d')
    # --- Xử lý code_tests ---
    if assignment.type in ['code', 'mixed'] and 'code_tests' in data:
        req_tests = data.get('code_tests', [])
        req_test_ids = set([t.get('test_id') for t in req_tests if t.get('test_id') is not None])
        db_tests = AssignmentCodeTest.query.filter_by(assignment_id=assignment.assignment_id).all()
        db_test_ids = set([t.test_id for t in db_tests])
        for db_test in db_tests:
            if db_test.test_id not in req_test_ids:
                db.session.delete(db_test)
        for test in req_tests:
            if test.get('test_id') in db_test_ids:
                db_test = next((t for t in db_tests if t.test_id == test['test_id']), None)
                if db_test:
                    db_test.input_data = test['input_data']
                    db_test.expected_output = test['expected_output']
                    db_test.score_weight = test.get('score_weight', 1.0)
            else:
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
        for db_q in db_questions:
            if db_q.question_id not in req_question_ids:
                db.session.delete(db_q)
        for q in req_questions:
            if q.get('question_id') in db_question_ids:
                db_q = next((qq for qq in db_questions if qq.question_id == q['question_id']), None)
                if db_q:
                    db_q.question_text = q['question_text']
                    db_q.options = q.get('options', [])
                    db_q.correct_index = q.get('correct_index', 0)
                    db_q.score_weight = q.get('score_weight', 1.0)
            else:
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
    return assignment

def delete_assigment(assignment_id):
    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return None
    db.session.delete(assignment)
    db.session.commit()
    return assignment_id