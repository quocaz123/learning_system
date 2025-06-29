import React, { useState } from 'react';
import Sidebar from '../components/Common/Sidebar';
import TopBar from '../components/Common/TopBar';
import HomeContent from '../components/Student/HomeContent';
import CoursesContent from '../components/Student/CoursesContent';
import AssignmentContent from '../components/Student/AssignmentContent';
import { profileData, courses, assignments, menuItems } from '../data/student/home';

import {
    Home, BookOpen, FileText, MessageCircle, User, Settings,
    X, Menu, CheckCircle, Clock, BookOpenCheck, Calendar, Award, Eye, Play, Search, Bell
} from 'lucide-react';
import UserProfileContent from '../components/Student/UserProfileContent';

const HomePage = () => {
    const [activeMenu, setActiveMenu] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Hàm renderContent
    const renderContent = () => {
        switch (activeMenu) {
            case 'home':
                return <HomeContent studentName={profileData.name} courses={courses} assignments={assignments} />;
            case 'courses':
                return <CoursesContent />
            case 'assignments':
                return <AssignmentContent />;
            case 'profile':
                return <UserProfileContent />
            default:
                return (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Trang {menuItems.find(item => item.id === activeMenu)?.label}</h2>
                        <p className="text-gray-600">Nội dung đang được phát triển...</p>
                    </div>
                );
        }
    };

    // 4. Giao diện
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                sidebarItems={menuItems}
                activeTab={activeMenu}
                setActiveTab={setActiveMenu}
                sidebarOpen={sidebarOpen}
                headerContent={null}
            />
            <div className="flex-1 lg:ml-0">
                <TopBar
                    title={activeMenu === 'home' ? 'DASHBOARD' : menuItems.find(item => item.id === activeMenu)?.label?.toUpperCase()}
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    userName={profileData.name}
                    userEmail={profileData.email}
                    avatar={profileData.avatar}
                    rightContent={
                        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                    }
                />
                <div className="p-4 width-max">
                    {renderContent()}
                </div>
            </div>
           
        </div>
    );
};

export default HomePage;