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

def token_required(allowed_roles=[]):
    def wrapper(f):
        def decorator(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify({"error": "Thiếu token"}), 401
            token = auth_header.split(" ")[1]
            data = decode_token(token)
            if "error" in data:
                return jsonify(data), 401
            if allowed_roles and data["role"] not in allowed_roles:
                return jsonify({"error": "Không có quyền"}), 403
            request.user = data

            if 'jti' in data and redis_client.get(f"blacklist:{data['jti']}"):
                return jsonify({"error": "Token đã bị vô hiệu hóa"}), 401

            return f(*args, **kwargs)
        decorator.__name__ = f.__name__
        return decorator
    return wrapper

def get_jwt_identity():
    return request.user.get("sub")