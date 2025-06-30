from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class Assignment(db.Model):
    __tablename__ = 'assignments'

    assignment_id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.lesson_id'))
    type = db.Column(db.String(20))
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    due_date = db.Column(db.Date)
    test_cases = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    submissions = db.relationship('Submission', backref='assignment')

class Submission(db.Model):
    __tablename__ = 'submissions'

    submission_id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.assignment_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    code = db.Column(db.Text)
    file_url = db.Column(db.Text)
    status = db.Column(db.String(20))
    submitted_at = db.Column(db.DateTime)

    grades = db.relationship('Grade', backref='submission', uselist=False)

class Grade(db.Model):
    __tablename__ = 'grades'

    grade_id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey('submissions.submission_id'), nullable=False)
    score = db.Column(db.Float)
    rubric = db.Column(db.Text)
    feedback = db.Column(db.Text)
    graded_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    graded_at = db.Column(db.DateTime, default=datetime.utcnow)
