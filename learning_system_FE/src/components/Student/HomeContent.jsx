import React from 'react';
import { BookOpenCheck, CheckCircle, Clock } from 'lucide-react';
import { getName } from "../../../services/AuthService"

const HomeContent = ({ courses, assignments }) => {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Xin chào, {getName()}!</h2>
                <p className="text-blue-100">Chào mừng bạn trở lại với hệ thống học tập</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <BookOpenCheck className="mr-2 text-blue-500" size={20} />
                        Khóa học đang theo học
                    </h3>
                    <div className="space-y-4">
                        {courses.map((course, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">{course.name}</h4>
                                    <span className="text-sm text-gray-600">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${course.color} h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${course.progress}%` }}
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
    )
}
export default HomeContent;