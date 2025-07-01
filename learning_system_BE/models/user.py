from database import db
from sqlalchemy.dialects.postgresql import UUID
import pyotp
from datetime import datetime
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), default='student')
    is_active = db.Column(db.Boolean, default=True)
    is_2fa_enabled = db.Column(db.Boolean, default=False)
    otp_secret = db.Column(db.String(32), default=lambda: pyotp.random_base32())
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    profile = db.relationship("Profile", backref="user", uselist=False)

class Profile(db.Model):
    __tablename__ = 'profiles'

    profile_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    full_name = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    birth_date = db.Column(db.Date)
    bio = db.Column(db.Text)