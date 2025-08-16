from flask import Flask
from flask_jwt_extended import JWTManager
from config import Config
from routes import user, profile, assignments, courses, log
from routes.notifications import notification_bp  # Import the new blueprint
from flask_cors import CORS
from database import db
from sqlalchemy import text
from flask import request, jsonify
from services.auth_service import decode_token
from flask_redis import FlaskRedis
import os
from dotenv import load_dotenv
from services.account_service import create_admin_assistants
from flask import send_from_directory
from routes.fileupload import fileupload_bp

load_dotenv()

# Khởi tạo redis_client
from flask import Flask
app = Flask(__name__)
app.config['REDIS_URL'] = os.getenv("REDIS_URL")
redis_client = FlaskRedis(app)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])
    db.init_app(app)
    JWTManager(app)
    app.register_blueprint(user.bp)
    app.register_blueprint(profile.profile_bp)
    app.register_blueprint(assignments.assignment_bp)
    app.register_blueprint(courses.course_bp)
    app.register_blueprint(user.course_user)
    app.register_blueprint(courses.lesson_bp)
    app.register_blueprint(log.log_bp)
    app.register_blueprint(notification_bp) # Register the notification blueprint
    # Đăng ký blueprint cho LM Studio
    from routes.lmstudio import lmstudio_bp
    app.register_blueprint(lmstudio_bp)
    # Đăng ký dashboard
    from routes.dashboard import dashboard_bp
    app.register_blueprint(dashboard_bp)
    # Đăng ký adminuser
    from routes.adminuser import adminuser_bp
    app.register_blueprint(adminuser_bp)
    #Đăng ký report_statistics
    from routes.report_statistics import report_statistics_bp
    app.register_blueprint(report_statistics_bp)
    app.register_blueprint(fileupload_bp)  # Đăng ký blueprint phục vụ file upload

    from routes.chat import chat_bp
    app.register_blueprint(chat_bp)

    from routes.backup import backup_bp
    app.register_blueprint(backup_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        from database import db
        db.create_all()  # Tạo tất cả bảng theo models
        create_admin_assistants()
    
    

    app.run(debug=True)