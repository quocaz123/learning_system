import React, { useState, useEffect } from 'react';
import {
    FileText,
    BookOpen,

} from 'lucide-react';
import { getMyCoursesAPI, getLessonDetailAPI, completeLessonAPI } from '../../../services/CourseService';
import { getName } from '../../../services/AuthService';

const CoursesContent = ({ selectedCourse }) => {
    const [courses, setCourses] = useState([]);
    const [selected, setSelected] = useState(selectedCourse ? selectedCourse.course_id : null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [lessonDetail, setLessonDetail] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        getMyCoursesAPI()
            .then(res => {
                setCourses(res.data || []);
                console.log("API /my-courses:", res.data);
                if (res.data && res.data.length > 0) setSelected(res.data[0].course_id);
            })
            .catch(() => setCourses([]));
    }, []);

    useEffect(() => {
        if (selectedCourse && selectedCourse.course_id) {
            setSelected(selectedCourse.course_id);
        }
    }, [selectedCourse]);

    // Reset lesson khi đổi course
    useEffect(() => {
        setSelectedLesson(null);
        setLessonDetail(null);
        setIsCompleted(false);
    }, [selected]);

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
        setIsCompleted(!!lesson.completed);
        getLessonDetailAPI(lesson.lesson_id)
            .then(res => {
                setLessonDetail(res.data);
                console.log("Lesson detail:", res.data);
            })
            .catch(() => setLessonDetail(null));
    };

    // Lấy course đang chọn từ mảng courses
    const currentCourse = courses.find(c => c.course_id === selected);
    const lessons = currentCourse && Array.isArray(currentCourse.lessons) ? currentCourse.lessons : [];

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Khóa học</h2>
                </div>
                <div className="p-4 border-b border-gray-200">
                    <div className="space-y-2">
                        {courses.map((course) => (
                            <button
                                key={course.course_id}
                                onClick={() => setSelected(course.course_id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${selected === course.course_id ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                            >
                                <div className="font-medium">{course.title}</div>
                                <div className="text-sm text-gray-500">{course.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Danh sách bài học</h3>
                    <div className="space-y-2">
                        {lessons.length > 0 ? (
                            lessons.map((lesson) => (
                                <button
                                    key={lesson.lesson_id}
                                    onClick={() => handleSelectLesson(lesson)}
                                    className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${selectedLesson?.lesson_id === lesson.lesson_id ? 'bg-blue-50 text-blue-800' : 'text-gray-700'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium flex items-center gap-2">
                                                {lesson.title}
                                                {lesson.completed && (
                                                    <span className="text-green-600 ml-1" title="Đã hoàn thành">✓</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-gray-500 text-sm">Chưa có bài học nào.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {lessonDetail ? (
                    <div className="p-6">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <BookOpen className="w-4 h-4" />
                                {currentCourse?.title}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{lessonDetail.title}</h1>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lessonDetail.content_html }} />

                            {/* Hiển thị video nếu có */}
                            {lessonDetail && lessonDetail.videos && lessonDetail.videos.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-semibold mb-2">Video bài học</h3>
                                    {lessonDetail.videos.map(video => (
                                        <div key={video.video_id} className="mb-4">
                                            <div className="font-medium">{video.title}</div>
                                            <iframe
                                                width="560"
                                                height="315"
                                                src={video.video_url}
                                                title={video.title}
                                                frameBorder="0"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hiển thị code block nếu có */}
                            {lessonDetail && lessonDetail.code_blocks && lessonDetail.code_blocks.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-semibold mb-2">Ví dụ minh họa</h3>
                                    {lessonDetail.code_blocks.map(block => (
                                        <div key={block.block_id} className="mb-4">
                                            <div className="font-medium">{block.title}</div>
                                            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                                                <code>
                                                    {block.code.replace(/\n/g, '\n')}
                                                </code>
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hiển thị file đính kèm nếu có */}
                            {lessonDetail && lessonDetail.attachments && lessonDetail.attachments.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-semibold mb-2">Tài liệu đính kèm</h3>
                                    <ul>
                                        {lessonDetail.attachments.map(file => (
                                            <li key={file.attachment_id}>
                                                <a
                                                    href={file.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {file.file_name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Nút hoàn thành bài học */}
                            <div className="mt-4">
                                {isCompleted ? (
                                    <span className="text-green-600 font-semibold flex items-center gap-2">
                                        ✓ Đã hoàn thành
                                    </span>
                                ) : (
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
                                        onClick={() => {
                                            const userInfo = getName();
                                            completeLessonAPI(userInfo.id, lessonDetail.lesson_id, selected)
                                                .then(() => {
                                                    setIsCompleted(true);
                                                    // Cập nhật trạng thái completed cho lesson trong danh sách lessons
                                                    setCourses(prevCourses =>
                                                        prevCourses.map(course =>
                                                            course.course_id === selected
                                                                ? {
                                                                    ...course,
                                                                    lessons: course.lessons.map(lesson =>
                                                                        lesson.lesson_id === lessonDetail.lesson_id
                                                                            ? { ...lesson, completed: true }
                                                                            : lesson
                                                                    )
                                                                }
                                                                : course
                                                        )
                                                    );
                                                    // Nếu đang chọn lesson, cập nhật luôn selectedLesson.completed
                                                    setSelectedLesson(prev =>
                                                        prev && prev.lesson_id === lessonDetail.lesson_id
                                                            ? { ...prev, completed: true }
                                                            : prev
                                                    );
                                                });
                                        }}
                                    >
                                        Hoàn thành bài học
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-gray-500">Chọn một bài học để xem nội dung.</div>
                )}
            </div>
        </div>
    );
};

export default CoursesContent;
