from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class Log(db.Model):
    __tablename__ = 'logs'

    log_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    action_type = db.Column(db.Text)
    action_data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Notification(db.Model):
    __tablename__ = 'notifications'

    notification_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)

class Comment(db.Model):
    __tablename__ = 'comments'

    comment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'))
    content = db.Column(db.Text)
    rating = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class FileUpload(db.Model):
    __tablename__ = 'fileuploads'

    file_id = db.Column(db.Integer, primary_key=True)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    file_name = db.Column(db.Text)
    file_path = db.Column(db.Text)
    file_type = db.Column(db.Text)
    related_lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.lesson_id'))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
