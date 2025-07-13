from database import db
from models import Course, Lesson, User, UserCourse
from sqlalchemy import text
from models import Lesson, LessonProgress

def create_course_service(user_id, title, description, language):
    """
    Tạo khóa học mới
    """
    try:
        # Validate input
        if not title or len(title.strip()) < 3:
            return {
                'success': False,
                'error': 'Course title must be at least 3 characters long'
            }
        
        if len(title) > 255:
            return {
                'success': False,
                'error': 'Course title must be less than 255 characters'
            }
        
        # BỎ kiểm tra trùng tên khóa học
        # existing_course = Course.query.filter_by(
        #     created_by=user_id, 
        #     title=title.strip()
        # ).first()
        # 
        # if existing_course:
        #     return {
        #         'success': False,
        #         'error': 'A course with this title already exists'
        #     }
        
        # Create new course
        new_course = Course(
            title=title.strip(),
            description=description.strip() if description else '',
            language=language,
            created_by=user_id
        )
        
        db.session.add(new_course)
        db.session.commit()
        
        # Return success response
        return {
            'success': True,
            'course_id': new_course.course_id,
            'data': {
                'course_id': new_course.course_id,
                'title': new_course.title,
                'description': new_course.description,
                'language': new_course.language,
                'created_by': new_course.created_by,
                'created_at': new_course.created_at.isoformat() if new_course.created_at else None
            }
        }
        
    except Exception as e:
        db.session.rollback()
        return {
            'success': False,
            'error': f'Database error: {str(e)}'
        }

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

def create_lesson_service(user_id, course_id, title, content_html, code_blocks=None, videos=None, attachments=None):
    """
    Tạo bài học mới với đầy đủ thông tin (code_blocks, videos, attachments)
    """
    from models import Lesson, LessonCodeBlock, LessonVideo, LessonAttachment
    try:
        # Validate input
        if not title or len(title.strip()) < 3:
            return {'success': False, 'error': 'Lesson title must be at least 3 characters long'}
        if not course_id:
            return {'success': False, 'error': 'Course ID is required'}
        # Tạo lesson
        lesson = Lesson(
            course_id=course_id,
            title=title.strip(),
            content_html=content_html or ''
        )
        db.session.add(lesson)
        db.session.flush()  # Để lấy lesson_id
        # Thêm code_blocks nếu có
        if code_blocks:
            for block in code_blocks:
                cb = LessonCodeBlock(
                    lesson_id=lesson.lesson_id,
                    title=block.get('title', ''),
                    language=block.get('language', ''),
                    code=block.get('code', ''),
                    display_order=block.get('display_order', 1)
                )
                db.session.add(cb)
        # Thêm videos nếu có
        if videos:
            for video in videos:
                v = LessonVideo(
                    lesson_id=lesson.lesson_id,
                    title=video.get('title', ''),
                    video_url=video.get('video_url', ''),
                    display_order=video.get('display_order', 1)
                )
                db.session.add(v)
        # Thêm attachments nếu có
        if attachments:
            for att in attachments:
                a = LessonAttachment(
                    lesson_id=lesson.lesson_id,
                    file_name=att.get('file_name', ''),
                    file_url=att.get('file_url', ''),
                    file_type=att.get('file_type', ''),
                )
                db.session.add(a)
        db.session.commit()
        return {
            'success': True,
            'lesson_id': lesson.lesson_id,
            'data': {
                'lesson_id': lesson.lesson_id,
                'title': lesson.title,
                'content_html': lesson.content_html,
                'course_id': lesson.course_id
            }
        }
    except Exception as e:
        db.session.rollback()
        return {'success': False, 'error': f'Database error: {str(e)}'}