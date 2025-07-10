import React, { useState, useEffect } from 'react';
import { BookOpenCheck, CheckCircle, Clock, BookOpen, User } from 'lucide-react';
import { getAllCoursesAPI, enrollCourseAPI } from '../../../services/CourseService';
import AssignmentService from '../../../services/AssignmentService';
import { toast } from 'react-toastify';


const HomeContent = ({ studentName, setSelectedCourse, setActiveMenu }) => {
    const [courses, setCourses] = useState([]);
    const [statistics, setStatistics] = useState({ submitted_count: 0, grading_count: 0 });
    const [recentLogs, setRecentLogs] = useState([]);


    useEffect(() => {
        getAllCoursesAPI()
            .then(res => {
                setCourses(res.data || []);
            })
            .catch(() => setCourses([]));

        // Gọi thống kê nhanh khi mount
        handleStatistics();
        // Gọi API lấy hoạt động gần đây
        AssignmentService.getRecentLogs().then(res => {
            console.log(res);
            setRecentLogs(res || []);
        });
    }, []);

    const handleEnroll = (courseId) => {
        enrollCourseAPI(courseId)
            .then(() => {
                getAllCoursesAPI().then(res => setCourses(res.data || []));
                toast('Đăng kí khóa học thành công...')
            })
            .catch(() => {

            });
    };

    const handleStatistics = async () => {
        try {
            const res = await AssignmentService.getStatusAssignment();
            console.log(res);
            if (res && res) {
                setStatistics(res || { submitted_count: 0, grading_count: 0 });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Xin chào, {studentName}!</h2>
                <p className="text-blue-100">Chào mừng bạn trở lại với hệ thống học tập</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Courses */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <BookOpenCheck className="mr-2 text-blue-500" size={20} />
                        Khóa học đang theo học
                    </h3>
                    <div className="space-y-4">
                        {courses.map((course, index) => {
                            const colorClass = [
                                'bg-blue-500',
                                'bg-green-500',
                                'bg-purple-500',
                                'bg-orange-500'
                            ][index % 4];
                            return (
                                <div key={index} className="border-l-4 border-blue-500 pl-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">{course.title}</h4>
                                        <span className="text-sm text-gray-600">{course.percent_completed}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${course.percent_completed}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Thống kê nhanh</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
                            <div className="text-2xl font-bold text-green-600">{statistics.submitted_count}</div>
                            <div className="text-sm text-gray-600">Bài đã nộp</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <Clock className="mx-auto text-yellow-500 mb-2" size={24} />
                            <div className="text-2xl font-bold text-yellow-600">{statistics.grading_count}</div>
                            <div className="text-sm text-gray-600">Đang chấm</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Courses Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Khóa học của tôi</h1>
                        <p className="text-gray-600">Khám phá và đăng ký các khóa học mới</p>
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                        <BookOpen className="w-5 h-5" />
                        Xem tất cả
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.course_id}
                            className="bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow p-6 h-full flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {course.language}
                                </span>
                                {course.is_enrolled && (
                                    <div className="flex items-center text-green-600">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        <span className="text-sm">Đã đăng ký</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{course.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <BookOpen className="w-4 h-4 mr-1" />
                                        <span>{course.lesson_count} bài học</span>
                                    </div>
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-1" />
                                        <span>{course.author}</span>
                                    </div>
                                </div>

                                {course.is_enrolled && course.percent_completed > 0 && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Tiến độ</span>
                                            <span>{course.percent_completed}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${course.percent_completed}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    if (course.is_enrolled) {
                                        setSelectedCourse && setSelectedCourse(course);
                                        setActiveMenu && setActiveMenu('courses');
                                    } else {
                                        handleEnroll(course.course_id);
                                    }
                                }}
                                className="w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm mt-auto
                                    bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {course.is_enrolled ? 'Vào học' : 'Đăng ký học'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                    {recentLogs.length === 0 && (
                        <div className="text-gray-400">Chưa có hoạt động nào gần đây.</div>
                    )}
                    {recentLogs.map((log) => (
                        <div key={log.log_id} className="flex items-center p-3 rounded-lg bg-blue-50">
                            <div className="w-2 h-2 rounded-full mr-3 bg-blue-500"></div>
                            <span className="text-sm flex-1">
                                {log.action_type === 'lesson_completed' && `Đã hoàn thành bài học "${log.action_data.lesson_title}"`}
                                {log.action_type === 'assignment_submitted' && `Nộp bài tập "${log.action_data.assignment_title}"`}
                                {log.action_type === 'course_enrolled' && `Bắt đầu khóa học "${log.action_data.course_title}"`}
                            </span>
                            <span className="text-xs text-gray-500 ml-auto">{new Date(log.created_at).toLocaleString('vi-VN', { hour12: false })}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeContent;