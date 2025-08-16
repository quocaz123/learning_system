from flask import Blueprint, request, jsonify
from utils.middleware import token_required, get_jwt_identity
from models.chat import ChatHistory
from database import db
import requests
import os

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat/ask', methods=['POST'])
@token_required()
def chat_ask():
    user_id = get_jwt_identity()
    data = request.json
    question = data.get('question', '')
    
    # Thêm chỉ dẫn cho Gemini để trả lời đúng ý
    formatted_question = f"Trả lời ngắn gọn, đơn giản và dễ hiểu: {question}"

    gemini_api_key = os.getenv("GEMINI_API_KEY")
    url = os.getenv("URL_GEMINi_API")
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": gemini_api_key
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": formatted_question}
                ]
            }
        ]
    }
    response = requests.post(url, headers=headers, json=payload)
    result = response.json()
    try:
        answer = result["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        answer = "Xin lỗi, tôi không thể trả lời câu hỏi này."
    
    # Lưu lịch sử
    chat = ChatHistory(user_id=user_id, question=question, answer=answer)
    db.session.add(chat)
    db.session.commit()
    return jsonify({"answer": answer})


@chat_bp.route('/chat/history', methods=['GET'])
@token_required()
def chat_history():
    user_id = get_jwt_identity()
    history = ChatHistory.query.filter_by(user_id=user_id).order_by(ChatHistory.created_at.desc()).limit(50).all()
    result = [
        {
            "question": c.question,
            "answer": c.answer,
            "created_at": c.created_at.isoformat()
        }
        for c in history
    ]
    return jsonify({"history": result})

@chat_bp.route('/chat/history', methods=['DELETE'])
@token_required()
def delete_chat_history():
    user_id = get_jwt_identity()
    from models.chat import ChatHistory
    from database import db
    ChatHistory.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({'message': 'Đã xóa lịch sử chat.'}), 200 