from database import db
from sqlalchemy.orm import relationship
from datetime import datetime

class Assignment(db.Model):
    __tablename__ = 'assignments'

    assignment_id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.lesson_id'), nullable=False)
    type = db.Column(db.String(20), default='mixed')  # code / quiz / upload / mixed
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    code_tests = db.relationship('AssignmentCodeTest', backref='assignment', cascade="all, delete-orphan")
    quiz_questions = db.relationship('AssignmentQuizQuestion', backref='assignment', cascade="all, delete-orphan")
    submissions = db.relationship('Submission', backref='assignment', cascade="all, delete-orphan")


class AssignmentCodeTest(db.Model):
    __tablename__ = 'assignment_code_tests'

    test_id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.assignment_id'), nullable=False)
    input_data = db.Column(db.Text, nullable=False)
    expected_output = db.Column(db.Text, nullable=False)
    score_weight = db.Column(db.Float, default=1.0)

class AssignmentQuizQuestion(db.Model):
    __tablename__ = 'assignment_quiz_questions'

    question_id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.assignment_id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False)  # List[str]
    correct_index = db.Column(db.Integer, nullable=False)
    score_weight = db.Column(db.Float, default=1.0)

class Submission(db.Model):
    __tablename__ = 'submissions'

    submission_id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.assignment_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    code = db.Column(db.Text)  # nếu là bài lập trình
    quiz_answers = db.Column(db.JSON)  # list[int], nếu là bài quiz
    file_url = db.Column(db.Text)  # nếu là bài upload
    status = db.Column(db.String(20), default='draft')  # draft, submitted
    submitted_at = db.Column(db.DateTime)

    grade = db.relationship('Grade', backref='submission', uselist=False, cascade="all, delete-orphan")

class Grade(db.Model):
    __tablename__ = 'grades'

    grade_id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey('submissions.submission_id'), nullable=False)
    score = db.Column(db.Float)
    rubric = db.Column(db.Text)
    feedback = db.Column(db.Text)
    graded_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    graded_at = db.Column(db.DateTime, default=datetime.utcnow)
