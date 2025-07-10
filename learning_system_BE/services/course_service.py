from database import db
from models import Course, Lesson, User, UserCourse
from sqlalchemy import text
from models import Lesson, LessonProgress

def count_completed_lessons(user_id, course_id):
    

    # Lấy tất cả lesson_id của khóa học đó
    lesson_ids = [lesson.lesson_id for lesson in Lesson.query.filter_by(course_id=course_id).all()]

    # Đếm số bài đã hoàn thành
    completed_count = LessonProgress.query.filter(
        LessonProgress.user_id == user_id,
        LessonProgress.lesson_id.in_(lesson_ids),
        LessonProgress.completed == True
    ).count()

    return completed_count

def get_all_courses_service(user_id):
    results = []
    courses = Course.query.all()
    
    for course in courses:
        lesson_count = Lesson.query.filter_by(course_id=course.course_id).count()
        is_enrolled = UserCourse.query.filter_by(user_id=user_id, course_id=course.course_id).first() is not None
        
        # Tính phần trăm hoàn thành
        percent_completed = 0
        if is_enrolled:
            lesson_ids = [l.lesson_id for l in Lesson.query.filter_by(course_id=course.course_id).all()]
            if lesson_ids:
                completed = db.session.execute(
                    text("""
                        SELECT COUNT(*) FROM lesson_progress 
                        WHERE user_id = :uid 
                        AND lesson_id = ANY(:lids) 
                        AND completed = TRUE
                    """),
                    {"uid": user_id, "lids": lesson_ids}
                ).scalar() or 0
                percent_completed = round(completed / lesson_count * 100) if lesson_count else 0

        # Lấy thông tin tác giả
        author = "Unknown"
        creator = User.query.get(course.created_by)
        if creator:
            author = creator.email  # fallback nếu không có profile
            if creator.profile and creator.profile.full_name:
                author = creator.profile.full_name
        
        # Gộp dữ liệu
        results.append({
            "course_id": course.course_id,
            "title": course.title,
            "description": course.description,
            "language": course.language,
            "author": author,
            "lesson_count": lesson_count,
            "is_enrolled": is_enrolled,
            "percent_completed": percent_completed
        })
    
    return results

def get_lesson_detail_service(lesson_id):
    from models import Lesson
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return None
    lesson_data = {
        "lesson_id": lesson.lesson_id,
        "title": lesson.title,
        "content_html": lesson.content_html,
        "code_blocks": [
            {
                "block_id": cb.block_id,
                "title": cb.title,
                "language": cb.language,
                "code": cb.code,
                "display_order": cb.display_order
            }
            for cb in lesson.code_blocks
        ],
        "videos": [
            {
                "video_id": v.video_id,
                "title": v.title,
                "video_url": v.video_url,
                "display_order": v.display_order
            }
            for v in lesson.videos
        ],
        "attachments": [
            {
                "attachment_id": a.attachment_id,
                "file_name": a.file_name,
                "file_url": a.file_url,
                "file_type": a.file_type,
                "uploaded_at": a.uploaded_at
            }
            for a in lesson.attachments
        ],
    }
    return lesson_data