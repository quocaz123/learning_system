import React, { useEffect, useState } from 'react';
import AdminUserService from '../../../services/AdminUserService';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCourses = async (pageNum = 1) => {
        setLoading(true);
        try {
            const res = await AdminUserService.getCoursesAdmin(pageNum, perPage);
            setCourses(res.courses || []);
            setTotal(res.total || 0);
            setPage(res.page || 1);
        } catch (e) {
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(page);
        // eslint-disable-next-line
    }, [page, perPage]);

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Quản lý khóa học</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">Tên khóa học</th>
                            <th className="px-4 py-2 border">Người tạo</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Ngày tạo</th>
                            <th className="px-4 py-2 border">Số bài học</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-4">Đang tải...</td></tr>
                        ) : courses.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-4">Không có dữ liệu</td></tr>
                        ) : (
                            courses.map(course => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{course.name}</td>
                                    <td className="px-4 py-2 border">{course.creator}</td>
                                    <td className="px-4 py-2 border">{course.creator_email}</td>
                                    <td className="px-4 py-2 border">{course.created_at}</td>
                                    <td className="px-4 py-2 border text-center">{course.lessons_count}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    Trang {page} / {totalPages}
                </div>
                <div className="space-x-2">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                    >
                        Trước
                    </button>
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseManagement; 