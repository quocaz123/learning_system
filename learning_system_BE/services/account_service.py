from models.user import User  # hoặc từ models import User
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

def create_admin_assistants():
    # Danh sách tài khoản muốn tạo
    assistants = [
        {"email": "assistant1@dtu.edu.vn", "password": "123456", "role": "assistant"},
    ]
    for acc in assistants:
        # Kiểm tra đã tồn tại chưa
        user = User.query.filter_by(email=acc["email"]).first()
        if not user:
            new_user = User(
                email=acc["email"],
                password_hash=generate_password_hash(acc["password"]),
                role=acc["role"]
            )
            db.session.add(new_user)
    db.session.commit()