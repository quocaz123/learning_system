from flask import Flask
from flask_jwt_extended import JWTManager
from config import Config
from routes import user, profile, assignments
from flask_cors import CORS
from database import db
from sqlalchemy import text
from flask import request, jsonify
from services.auth_service import decode_token
from flask_redis import FlaskRedis
import os
from dotenv import load_dotenv

load_dotenv()

# Khởi tạo redis_client
from flask import Flask
app = Flask(__name__)
app.config['REDIS_URL'] = os.getenv("REDIS_URL")
redis_client = FlaskRedis(app)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
    db.init_app(app)
    JWTManager(app)
    app.register_blueprint(user.bp)
    app.register_blueprint(profile.profile_bp)
    app.register_blueprint(assignments.assignment_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        from database import db
        db.create_all()  # Tạo tất cả bảng theo models
    app.run(debug=True)