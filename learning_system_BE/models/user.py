from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
import pyotp

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), default="student")  # student, teacher, admin
    is_2fa_enabled = db.Column(db.Boolean, default=False)
    otp_secret = db.Column(db.String(32), default=lambda: pyotp.random_base32())
    # Nếu cần thêm các trường khác thì thêm ở đây