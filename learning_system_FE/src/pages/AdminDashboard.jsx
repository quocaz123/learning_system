import React, { useState, useEffect } from 'react';
import {
    Users, BookOpen, BarChart3, Settings, TrendingUp,  FileText, GraduationCap, Database
} from 'lucide-react';
import Sidebar from '../components/Common/Sidebar';
import StatCard from '../components/Admin/StatCard';
import TopBar from '../components/Common/TopBar';
import AdminUserService from '../../services/AdminUserService';
import RecentActivities from "../components/Admin/RecentActivities";
import UserManagement from "../components/Admin/UserManagement";
import ReportStatistics from "../components/Admin/ReportStatistics";
import { getName } from '../../services/AuthService';
import UserProfileSystem from '../components/Student/UserProfileContent';
import CourseManagement from '../components/Admin/CourseManagement';
import BackupRestoreManager from '../components/Admin/BackupRestoreManager';
const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
    { id: 'courses', label: 'Quản lý khóa học', icon: BookOpen },
    { id: 'reports', label: 'Báo cáo & Thống kê', icon: TrendingUp },
    // { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
    { id: 'backup', label: 'Sao lưu', icon: Database }
    // { id: 'logs', label: 'Nhật ký', icon: Activity }
];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inFor, setInFor] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        AdminUserService.getSummary()
            .then(data => {
                setDashboard(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải dữ liệu dashboard');
                setLoading(false);
            });
        const userInfor = getName();
        if (userInfor) {
            setInFor(userInfor.fullName || '');
            setRole(userInfor.role || 'Student')
        }
    }, []);

    const renderDashboard = () => {
        if (loading) return <div>Đang tải dữ liệu...</div>;
        if (error) return <div className="text-red-500">{error}</div>;
        if (!dashboard) return null;
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Tổng người dùng" value={dashboard.total_users} icon={Users} trend={dashboard.users_percent} color="blue" />
                    <StatCard title="Khóa học" value={dashboard.total_courses} icon={BookOpen} trend={dashboard.courses_percent} color="green" />
                    <StatCard title="Sinh viên hoạt động" value={dashboard.active_students} icon={GraduationCap} trend={dashboard.students_percent} color="purple" />
                    <StatCard title="Bài nộp" value={dashboard.total_submissions} icon={FileText} trend={dashboard.submissions_percent} color="orange" />
                </div>
                <RecentActivities />
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'users':
                return <UserManagement />;
            case 'courses':
                    return <CourseManagement />;
            case 'reports':
                return <ReportStatistics />;
            case 'backup':
                return <BackupRestoreManager />;
            case 'settings':
                return <UserProfileSystem />;
            // Các case khác có thể tách thành component riêng nếu cần
            default:
                return (
                    <div className="text-center py-12">
                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chức năng đang phát triển</h3>
                        <p className="text-gray-600">Nội dung sẽ được cập nhật sớm</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                sidebarItems={sidebarItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                headerContent={null}
            />
            <div className="flex-1 flex flex-col">
                <TopBar
                    title={sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    inFor={inFor}
                    role={role}
                   
                />
                <main className="flex-1 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard; 