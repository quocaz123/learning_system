import React, { useState, useEffect } from 'react';
import {
    Users, BookOpen, BarChart3, Settings, Shield, Database, Activity, TrendingUp, Code, FileText, GraduationCap, Bell
} from 'lucide-react';
import Sidebar from '../components/Common/Sidebar';
import StatCard from '../components/Admin/StatCard';
import TopBar from '../components/Common/TopBar';
import { stats } from '../data/admin/stats';
import { recentActivities } from '../data/admin/activities';
import { getName } from "../../services/AuthService"

const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
    { id: 'courses', label: 'Quản lý khóa học', icon: BookOpen },
    { id: 'reports', label: 'Báo cáo & Thống kê', icon: TrendingUp },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'system', label: 'Hệ thống', icon: Settings },
    { id: 'backup', label: 'Sao lưu', icon: Database },
    { id: 'logs', label: 'Nhật ký', icon: Activity }
];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [inFor, setInFor] = useState('');
    const [role, setRole] = useState('');
    
        useEffect(() => {
            const userInfo = getName();
            if (userInfo) {
                setInFor(userInfo.fullName || '');
                setRole(userInfo.role || 'Student');
            }
        }, []);

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tổng người dùng" value={stats.totalUsers} icon={Users} trend={12} color="blue" />
                <StatCard title="Khóa học" value={stats.totalCourses} icon={BookOpen} trend={8} color="green" />
                <StatCard title="Sinh viên hoạt động" value={stats.activeStudents} icon={GraduationCap} trend={-3} color="purple" />
                <StatCard title="Bài nộp" value={stats.totalSubmissions} icon={FileText} trend={25} color="orange" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${activity.type === 'submission' ? 'bg-blue-100' :
                                    activity.type === 'login' ? 'bg-green-100' :
                                        activity.type === 'completion' ? 'bg-purple-100' : 'bg-orange-100'
                                    }`}>
                                    {activity.type === 'submission' && <Code className="h-4 w-4 text-blue-600" />}
                                    {activity.type === 'login' && <Users className="h-4 w-4 text-green-600" />}
                                    {activity.type === 'completion' && <GraduationCap className="h-4 w-4 text-purple-600" />}
                                    {activity.type === 'course' && <BookOpen className="h-4 w-4 text-orange-600" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                                    <p className="text-sm text-gray-600">{activity.action}</p>
                                </div>
                                <span className="text-xs text-gray-500">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
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
                    rightContent={
                        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
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

export default AdminDashboard; 