from models import Notification, UserCourse
from database import db
from sqlalchemy.orm import joinedload


def create_notification(user_id, message, link=None):
    """
    Creates a new notification for a user.
    """
    new_notification = Notification(
        user_id=user_id,
        message=message
    )
    db.session.add(new_notification)
    db.session.commit()
    return new_notification

def get_notifications_by_user(user_id, unread_only=False):
    """
    Retrieves notifications for a specific user.
    """
    query = Notification.query.filter_by(user_id=user_id)
    if unread_only:
        query = query.filter_by(is_read=False)
    
    return query.order_by(Notification.sent_at.desc()).all()

def mark_as_read(notification_id, user_id):
    """
    Marks a notification as read if it belongs to the user.
    """
    notification = Notification.query.filter_by(notification_id=notification_id, user_id=user_id).first()
    if notification:
        notification.is_read = True
        db.session.commit()
    return notification

def mark_all_as_read(user_id):
    """
    Marks all unread notifications for a user as read.
    """
    Notification.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
    db.session.commit()

def create_notifications_for_course(course_id, message):
    """
    Creates notifications for all students enrolled in a course.
    """
    # Find all user_ids for the given course_id
    user_courses = UserCourse.query.filter_by(course_id=course_id).all()
    student_ids = [uc.user_id for uc in user_courses]

    notifications = []
    for user_id in student_ids:
        new_notification = Notification(
            user_id=user_id,
            message=message
        )
        notifications.append(new_notification)

    if notifications:
        db.session.add_all(notifications)
        db.session.commit()
        
    return notifications 