from database import db
from datetime import datetime

class Course(db.Model):
    __tablename__ = 'courses'

    course_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    language = db.Column(db.String(20))
    created_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    lessons = db.relationship('Lesson', backref='course', cascade="all, delete-orphan")

class Lesson(db.Model):
    __tablename__ = 'lessons'

    lesson_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content_html = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    code_blocks = db.relationship('LessonCodeBlock', backref='lesson')
    videos = db.relationship('LessonVideo', backref='lesson')
    attachments = db.relationship('LessonAttachment', backref='lesson')

class LessonCodeBlock(db.Model):
    __tablename__ = 'lessoncodeblocks'

    block_id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.lesson_id'), nullable=False)
    title = db.Column(db.Text)
    language = db.Column(db.String(20))
    code = db.Column(db.Text, nullable=False)
    display_order = db.Column(db.Integer, default=1)

class LessonVideo(db.Model):
    __tablename__ = 'lessonvideos'

    video_id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.lesson_id'), nullable=False)
    title = db.Column(db.Text)
    video_url = db.Column(db.Text, nullable=False)
    display_order = db.Column(db.Integer, default=1)

class LessonAttachment(db.Model):
    __tablename__ = 'lessonattachments'

    attachment_id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.lesson_id'), nullable=False)
    file_name = db.Column(db.Text)
    file_url = db.Column(db.Text)
    file_type = db.Column(db.Text)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class LessonProgress(db.Model):
    __tablename__ = 'lesson_progress'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.lesson_id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime)

