import React, { useState, useEffect } from 'react';
import { BookOpenCheck, CheckCircle, Clock, BookOpen, User } from 'lucide-react';
import { getName } from "../../../services/AuthService"
import { getAllCoursesAPI, enrollCourseAPI } from '../../../services/CourseService';


const HomeContent = ({ assignments, setSelectedCourse, setCurrentView }) => {
    const [studentName, setStudentName] = useState('');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const userInfo = getName();
        if (userInfo && userInfo.fullName) {
            setStudentName(userInfo.fullName);
        }
    }, []);

    useEffect(() => {
        getAllCoursesAPI()
            .then(res => {
                setCourses(res.data || []);
            })
            .catch(() => setCourses([]));
    }, []);

    const handleEnroll = (courseId) => {
        enrollCourseAPI(courseId)
            .then(() => {
                getAllCoursesAPI().then(res => setCourses(res.data || []));
            })
            .catch(() => {
               
            });
    };

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
                        {courses.map((course, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">{course.title}</h4>
                                    <span className="text-sm text-gray-600">{course.percent_completed}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${course.color} h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${course.percent_completed}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Thống kê nhanh</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
                            <div className="text-2xl font-bold text-green-600">{assignments.filter(a => a.status === 'submitted').length}</div>
                            <div className="text-sm text-gray-600">Bài đã nộp</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <Clock className="mx-auto text-yellow-500 mb-2" size={24} />
                            <div className="text-2xl font-bold text-yellow-600">{assignments.filter(a => a.status === 'grading').length}</div>
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
                    {courses.map(course => (
                        <div key={course.course_id} className="bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow p-6">
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

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                            <p className="text-gray-600 mb-4 text-sm">{course.description}</p>

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

                            <button
                                onClick={() => {
                                    if (course.is_enrolled) {
                                        setSelectedCourse && setSelectedCourse(course);
                                        setCurrentView && setCurrentView('courseDetail');
                                    } else {
                                        handleEnroll(course.course_id);
                                    }
                                }}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm ${course.is_enrolled
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
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
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm">Đã hoàn thành bài học "Vòng lặp trong Python"</span>
                        <span className="text-xs text-gray-500 ml-auto">2 giờ trước</span>
                    </div>
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm">Nộp bài tập "Thuật toán sắp xếp"</span>
                        <span className="text-xs text-gray-500 ml-auto">1 ngày trước</span>
                    </div>
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm">Bắt đầu khóa học "Perl nâng cao"</span>
                        <span className="text-xs text-gray-500 ml-auto">3 ngày trước</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeContent;