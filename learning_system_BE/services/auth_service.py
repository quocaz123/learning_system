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
        "sub" : str(user.user_id),
        "name" : user.profile.full_name if hasattr(user, 'profile') and user.profile else "",
        "role" : user.role,
        "iat" : now,
        "exp" : now + datetime.timedelta(minutes=15),
        "csrf" : str(uuid.uuid4()),
        "type" : "access",
        "jti" : str(uuid.uuid4())
    }

    refresh_payload = {
        "sub" : str(user.user_id),
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
        if isinstance(token, str):
            token = token.encode('utf-8')
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except Exception as e:
        print("Decode token error:", e)
        return {"error": "Token không hợp lệ", "detail": str(e)}