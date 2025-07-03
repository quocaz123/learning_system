import React, { useState } from 'react';
import {
    PlusCircle,
    Edit3,
    Trash2,
    Eye,
    Download,
    Bell,
    Search
} from 'lucide-react';
import TopBar from '../components/Common/TopBar';
import Sidebar from '../components/Common/Sidebar';
import { sidebarItems, courses, assignments, students } from '../data/teacher/data_dashboard';
import AssignmentCreate from '../components/Teacher/AssignmentCreate';
import AssignmentList from '../components/Teacher/AssignmentList';
import HomeContent from '../components/Teacher/HomeContent';

const TeacherDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);



    const CoursesTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                    <PlusCircle size={20} className="mr-2" />
                    Thêm khóa học
                </button>
            </div>
            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa học</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sinh viên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài giảng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài tập</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.map(course => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.students}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.lessons}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.assignments}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {course.status === 'active' ? 'Hoạt động' : 'Bản nháp'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                                                <Eye size={16} />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const AssignmentsTab = () => {
        const [showCreate, setShowCreate] = useState(false);
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý bài tập</h2>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                        onClick={() => setShowCreate(prev => !prev)}
                    >
                        <PlusCircle size={20} className="mr-2" />
                        {showCreate ? 'Quay lại danh sách' : 'Tạo bài tập'}
                    </button>
                </div>

                {showCreate ? (
                    <AssignmentCreate onCancel={() => setShowCreate(false)} />
                ) : (
                    <AssignmentList assignments={assignments} />
                )}
            </div>
        );
    };

    const StudentsTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Sinh viên</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sinh viên..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                        <Download size={20} className="mr-2" />
                        Xuất báo cáo
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sinh viên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa học</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiến độ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoạt động cuối</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            <div className="text-sm text-gray-500">{student.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                                            </div>
                                            <span className="text-sm text-gray-500">{student.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastActive}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <HomeContent />;
            case 'courses':
                return <CoursesTab />;
            case 'assignments':
                return <AssignmentsTab />;
            case 'students':
                return <StudentsTab />;
            case 'upload':
                return <div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-bold">Tải lên tài liệu</h2><p className="text-gray-600 mt-2">Chức năng tải lên tài liệu sẽ được phát triển.</p></div>;
            case 'reports':
                return <div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-bold">Báo cáo</h2><p className="text-gray-600 mt-2">Chức năng báo cáo sẽ được phát triển.</p></div>;
            case 'settings':
                return <div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-bold">Cài đặt</h2><p className="text-gray-600 mt-2">Chức năng cài đặt sẽ được phát triển.</p></div>;
            default:
                return <Dashboard />;
        }
    };

    const getPageTitle = () => {
        const tabTitles = {
            dashboard: 'Dashboard',
            courses: 'Quản lý khóa học',
            assignments: 'Quản lý bài tập',
            students: 'Sinh viên',
            upload: 'Tải lên tài liệu',
            reports: 'Báo cáo',
            settings: 'Cài đặt'
        };
        return tabTitles[activeTab] || 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                sidebarItems={sidebarItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
            />
            <div className="flex-1 flex flex-col">
                <TopBar
                    title={getPageTitle()}
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    rightContent={
                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </button>
                    }
                />
                <main className="flex-1 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default TeacherDashboard;
