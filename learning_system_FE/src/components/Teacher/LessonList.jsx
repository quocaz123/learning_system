import React, { memo } from 'react';
import { ArrowLeft, PlusCircle, Search, BookOpen, Clock, MoreHorizontal, Eye, Edit3, Trash2 } from 'lucide-react';
import { deleteLessonAPI } from '../../../services/LessonService';

const LessonList = memo(({
    lessons = [],
    selectedCourseName = '',
    onBack,
    onCreateLesson,
    searchTerm = '',
    setSearchTerm = () => { },
    onViewLesson,
    onEditLesson,
    setLessons,
}) => {

    const filteredLessons = lessons.filter(lesson => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lesson.description ? lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) : false);
        return matchesSearch;
    });

    const handleDelete = async (lesson_id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài học này không?")) {
            try {
                await deleteLessonAPI(lesson_id);
                // Sau khi xóa, cập nhật lại danh sách bài học
                if (typeof window !== 'undefined') {
                    alert("Đã xóa bài học thành công!");
                }
                // Nếu có prop setLessons, gọi để cập nhật lại danh sách
                if (typeof setLessons === 'function') {
                    setLessons(prev => prev.filter(l => l.lesson_id !== lesson_id));
                }
                // Hoặc reload lại trang hoặc gọi lại API lấy danh sách bài học nếu cần
            } catch {
                alert("Xóa thất bại!");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Quay lại
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Bài học</h2>
                        <p className="text-gray-600">{selectedCourseName}</p>
                    </div>
                </div>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                    onClick={onCreateLesson}
                >
                    <PlusCircle size={20} className="mr-2" />
                    Thêm bài học
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài học..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Tổng: {filteredLessons.length} bài học</span>
                    </div>
                </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => {

                    return (
                        <div key={lesson.lesson_id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <BookOpen size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-gray-500">Mã bài học: {lesson.lesson_id}</span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <MoreHorizontal size={16} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {lesson.title}
                                    </h3>
                                </div>
                                {/* Stats */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Clock size={16} />
                                            <span>
                                                {lesson.created_at
                                                    ? lesson.created_at.split(' ')[0].split('-').reverse().join('/')
                                                    : '---'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            title="Xem chi tiết"
                                            onClick={() => onViewLesson && onViewLesson(lesson.lesson_id)}
                                        >
                                            <Eye size={16} />
                                            <span>Xem</span>
                                        </button>
                                        <button
                                            className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                                            title="Chỉnh sửa"
                                            onClick={() => onEditLesson && onEditLesson(lesson.lesson_id)}
                                        >
                                            <Edit3 size={16} />
                                            <span>Sửa</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded" title="Xóa" onClick={() => handleDelete(lesson.lesson_id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default LessonList; 