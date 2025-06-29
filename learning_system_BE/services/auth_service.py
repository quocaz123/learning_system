import jwt
import datetime
import uuid
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

def generate_token(user):

    now = datetime.datetime.utcnow()

    access_payload  = {
        "sub" : str(user.id),
        "name" : user.name,
        "role" : user.role,
        "2fa" : user.is_2fa_enabled,
        "iat" : now,
        "exp" : now + datetime.timedelta(minutes=15),
        "csrf" : str(uuid.uuid4()),
        "type" : "access",
        "jti" : str(uuid.uuid4())
    }

    refresh_payload = {
        "sub" : str(user.id),
        "type" : "refresh",
        "iat" : now,
        "exp" : now + datetime.timedelta(minutes=30),
        "jti" : str(uuid.uuid4()) # để quản lý / block nếu cần
    }
 
    access_token = jwt.encode(access_payload, SECRET_KEY, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm="HS256")

    return access_token, refresh_token

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except Exception as e:
        print("Decode token error:", e)
        return {"error": "Token không hợp lệ", "detail": str(e)}