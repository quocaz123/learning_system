from flask import Blueprint, request, jsonify
import requests
import os
import re

lmstudio_bp = Blueprint('lmstudio', __name__)

GEMINI_API_KEY = "AIzaSyCuGxALveKKIqQHdJ2nWE6U2ycXv7m_UVk"  # Hoặc lấy từ biến môi trường

@lmstudio_bp.route('/lmstudio/completion', methods=['POST'])
def code_completion():
    data = request.json
    code = data.get('code', '')
    user_prompt = (
        "Hãy hoàn thành đoạn code sau, chỉ trả về code, không giải thích, không bình luận, không thêm chú thích, không markdown:\n"
        + code
    )
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": user_prompt
                    }
                ]
            }
        ]
    }
    response = requests.post(url, headers=headers, json=payload)
    result = response.json()
    try:
        completion = result["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        completion = ""
    return jsonify({"completion": completion, "status": 200})

def clean_code(code):
    # Bỏ markdown code block nếu có
    code = re.sub(r"```[a-zA-Z]*\n(.*?)```", r"\1", text, flags=re.DOTALL).strip()
    # Bỏ docstring nếu có
    code = re.sub(r'""".*?"""', '', code, flags=re.DOTALL).strip()
    return code
