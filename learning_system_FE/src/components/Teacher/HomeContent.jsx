import {
    BookOpen,
    Users,
    FileText,
    PlusCircle,
    CheckCircle,
} from 'lucide-react';
import { assignments, students } from '../../data/teacher/data_dashboard';
const HomeContent = () => {

    const stats = {
        totalCourses: 3,
        totalStudents: 125,
        totalAssignments: 24,
        avgCompletion: 85
    };

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
                    <Icon size={24} />
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
                        {assignments.slice(0, 3).map(assignment => (
                            <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">{assignment.title}</p>
                                    <p className="text-sm text-gray-600">{assignment.course}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{assignment.submissions}/{assignment.total}</p>
                                    <p className="text-xs text-gray-500">Hạn: {assignment.dueDate}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Sinh viên xuất sắc</h3>
                    <div className="space-y-3">
                        {students.slice(0, 3).map(student => (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-sm text-gray-600">{student.course}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{student.progress}%</p>
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

};

export default HomeContent;