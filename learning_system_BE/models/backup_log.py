from database import db
from datetime import datetime

class BackupLog(db.Model):
    __tablename__ = 'backup_log'
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(20))  # 'backup' hoặc 'restore'
    filename = db.Column(db.String(255))
    size = db.Column(db.BigInteger)  # <--- Thêm dòng này
    status = db.Column(db.String(50))
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, nullable=True)