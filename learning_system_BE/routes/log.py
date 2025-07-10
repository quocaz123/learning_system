from flask import Blueprint, jsonify
from utils.middleware import token_required, get_jwt_identity
from models.log import Log

log_bp = Blueprint('log', __name__)

@log_bp.route('/logs/recent', methods=['GET'])
@token_required()
def get_recent_logs():
    user_id = get_jwt_identity()
    logs = Log.query.filter_by(user_id=user_id).order_by(Log.created_at.desc()).limit(10).all()
    result = [
        {
            'log_id': log.log_id,
            'action_type': log.action_type,
            'action_data': log.action_data,
            'created_at': log.created_at.isoformat()
        }
        for log in logs
    ]
    return jsonify(result), 200 