import React, { useEffect, useState } from 'react';
import {
    BookOpen,
    Users,
    FileText,
    PlusCircle,
    CheckCircle,
} from 'lucide-react';
import { getStatsAPI, getLogsAPI, getRecentSubmissionsAPI } from '../../../services/Teacher_Dashboard';

const HomeContent = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalAssignments: 0,
        avgCompletion: 0
    });
    const [studentLogs, setStudentLogs] = useState([]);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [showAllSubmissions, setShowAllSubmissions] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await getStatsAPI();
            if (res && res.data) {
                setStats({
                    totalCourses: res.data.total_courses,
                    totalStudents: res.data.total_students,
                    totalAssignments: res.data.total_assignments,
                    avgCompletion: res.data.avg_completion
                });
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const fetchLogs = async () => {
            const res = await getLogsAPI();
            console.log(res.data)
            if (res && res.data) {
                setStudentLogs(res.data);
            }
        };
        fetchLogs();
    }, []);

    useEffect(() => {
        const fetchRecentSubmissions = async () => {
            const res = await getRecentSubmissionsAPI();
            if (res && res.data) {
                setRecentSubmissions(res.data);
            }
        };
        fetchRecentSubmissions();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        color === 'green' ? 'bg-green-100 text-green-600' :
                            color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                'bg-orange-100 text-orange-600'
                    }`}>
                    {Icon && <Icon size={24} />}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <div className="flex items-center space-x-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                        <PlusCircle size={20} className="mr-2" />
                        Khóa học mới
                    </button>
                </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Tổng khóa học" value={stats.totalCourses} icon={BookOpen} color="blue" />
                <StatCard title="Tổng sinh viên" value={stats.totalStudents} icon={Users} color="green" />
                <StatCard title="Bài tập" value={stats.totalAssignments} icon={FileText} color="purple" />
                <StatCard title="Hoàn thành TB" value={`${stats.avgCompletion}%`} icon={CheckCircle} color="orange" />
            </div>
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Bài nộp gần đây</h3>
                    <div className="space-y-3">
                        {(recentSubmissions.length === 0) ? (
                            <p className="text-gray-500 text-sm">Chưa có bài nộp nào.</p>
                        ) : (
                            <>
                                {recentSubmissions.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{item.assignment_title}</p>
                                            <p className="text-sm text-gray-600">{item.course_title}</p>
                                            <p className="text-xs text-gray-500">Mã SV: {item.student_id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Nộp: {item.submitted_at ? new Date(item.submitted_at).toLocaleString() : ''}</p>
                                            <p className="text-xs text-gray-400">Hạn: {item.due_date ? new Date(item.due_date).toLocaleDateString() : ''}</p>
                                        </div>
                                    </div>
                                ))}
                                {recentSubmissions.length > 3 && (
                                    <button
                                        className="mt-2 text-blue-600 hover:underline text-sm"
                                        onClick={() => setShowAllSubmissions(true)}
                                    >
                                        Xem thêm
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Popup/drawer overlay */}
                    {showAllSubmissions && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                    onClick={() => setShowAllSubmissions(false)}
                                >
                                    Đóng
                                </button>
                                <h3 className="text-lg font-semibold mb-4">Tất cả bài nộp gần đây</h3>
                                <div className="space-y-3">
                                    {recentSubmissions.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{item.assignment_title}</p>
                                                <p className="text-sm text-gray-600">{item.course_title}</p>
                                                <p className="text-xs text-gray-500">Mã SV: {item.student_id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Nộp: {item.submitted_at ? new Date(item.submitted_at).toLocaleString() : ''}</p>
                                                <p className="text-xs text-gray-400">Hạn: {item.due_date ? new Date(item.due_date).toLocaleDateString() : ''}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Hoạt động sinh viên</h3>
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                        {studentLogs.length === 0 ? (
                            <p className="text-gray-500 text-sm">Chưa có hoạt động nào.</p>
                        ) : (
                            studentLogs.map(log => (
                                <div key={log.log_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">User ID: {log.user_id}</p>
                                        <p className="text-sm text-gray-600">{log.action_type}</p>
                                        <p className="text-xs text-gray-500">{log.action_data && JSON.stringify(log.action_data)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default HomeContent;