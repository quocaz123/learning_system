from flask import Blueprint, jsonify
from utils.middleware import token_required, get_jwt_identity
from services.notification_service import (
    get_notifications_by_user,
    mark_as_read,
    mark_all_as_read
)

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/notifications', methods=['GET'])
@token_required()
def get_my_notifications():
    user_id = get_jwt_identity()
    notifications = get_notifications_by_user(user_id)
    
    result = [
        {
            "notification_id": n.notification_id,
            "message": n.message,
            "is_read": n.is_read,
            "sent_at": n.sent_at.isoformat()
        }
        for n in notifications
    ]
    return jsonify(result), 200

@notification_bp.route('/notifications/unread-count', methods=['GET'])
@token_required()
def get_unread_count():
    user_id = get_jwt_identity()
    unread_notifications = get_notifications_by_user(user_id, unread_only=True)
    return jsonify({"unread_count": len(unread_notifications)}), 200

@notification_bp.route('/notifications/<int:notification_id>/read', methods=['POST'])
@token_required()
def read_notification(notification_id):
    user_id = get_jwt_identity()
    # Optional: Check if the notification actually belongs to the user
    notification = mark_as_read(notification_id)
    if notification and notification.user_id == user_id:
        return jsonify({"message": "Notification marked as read."}), 200
    return jsonify({"error": "Notification not found or access denied."}), 404

@notification_bp.route('/notifications/read-all', methods=['POST'])
@token_required()
def read_all_notifications():
    user_id = get_jwt_identity()
    mark_all_as_read(user_id)
    return jsonify({"message": "All notifications marked as read."}), 200 