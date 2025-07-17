import { Eye, Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAssignmentsAPI, deleteAssignmentAPI } from '../../../services/AssignmentService';
import {toast} from 'react-toastify';

const AssignmentList = () => {

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [assignments, setAssignments] = useState([]);

    const perPage = 10;

    useEffect(() => {
        fetchAssignments(page, perPage);
    }, [page]);

    const fetchAssignments = async (page, perPage) => {
        try {
            const res = await getAssignmentsAPI(page, perPage);

            if (res && res.status === 200) {
                setAssignments(res.assignments || []);
                setTotalPages(res.pages || 1);
            }
        } catch (error) {
           
            setAssignments([]);
            setTotalPages(1);
        }
    };

    const onPageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    }

    const handleDelete = async (assignmentId) => {
        if(!window.confirm("Bạn có chắc chắn muốn xóa bài tập này?")) return;
        try{
            const res = await deleteAssignmentAPI(assignmentId);
            if (res && res.status === 200) {
                fetchAssignments(page, perPage);
                toast.success("Xóa bài tập thành công!");
            }
        } catch (error) {
            toast.error("Xóa bài tập thất bại: " + (error.response?.data?.message || "Có lỗi xảy ra!"));
        }
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bài tập</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khóa học</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạn nộp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đã nộp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {assignments.map(assignment => (
                            <tr key={assignment.assignment_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{assignment.title}</td>
                                <td className="px-6 py-4">{assignment.course_name}</td>
                                <td className="px-6 py-4">{assignment.due_date}</td>
                                <td className="px-6 py-4">{assignment.submitted}/{assignment.total_students}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 p-1 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                                        <button className="text-green-600 p-1 hover:bg-green-50 rounded"><Edit3 size={16} /></button>
                                        <button onClick={() => handleDelete(assignment.assignment_id)} className="text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-end items-center gap-2 p-4">
                <button
                    className="px-3 py-1 rounded border disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    Trước
                </button>
                <span className="text-sm">
                    Trang {page} / {totalPages}
                </span>
                <button
                    className="px-3 py-1 rounded border disabled:opacity-50"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default AssignmentList;