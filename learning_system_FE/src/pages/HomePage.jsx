import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Common/Sidebar';
import TopBar from '../components/Common/TopBar';
import HomeContent from '../components/Student/HomeContent';
import CoursesContent from '../components/Student/CoursesContent';
import AssignmentContent from '../components/Student/AssignmentContent';
import { menuItems } from '../data/student/home';
import UserProfileContent from '../components/Student/UserProfileContent';
import { getName } from "../../services/AuthService"

const HomePage = () => {
    const [activeMenu, setActiveMenu] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [inFor, setInFor] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const userInfo = getName();
        if (userInfo) {
            setInFor(userInfo.fullName || '');
            setRole(userInfo.role || 'Student');
        }
    }, []);

    // Hàm đăng ký khóa học
    const enrollCourse = (courseId) => {
        console.log('Đăng ký khóa học:', courseId);
        // TODO: Implement enrollment logic
    };

    // Hàm renderContent
    const renderContent = () => {
        switch (activeMenu) {
            case 'home':
                return <HomeContent
                    inFor={inFor}
                    setSelectedCourse={setSelectedCourse}
                    setActiveMenu={setActiveMenu}
                    enrollCourse={enrollCourse}
                    setInFor={inFor}
                />;
            case 'courses':
                return <CoursesContent selectedCourse={selectedCourse} />
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
                    inFor={inFor}
                    role={role}
                    
                />
                <div className="p-4 width-max">
                    {renderContent()}
                </div>
            </div>

        </div>
    );
};

export default HomePage;