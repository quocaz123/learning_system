import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
// import các content component khác...

import {
    Home, BookOpen, FileText, MessageCircle, User, Settings,
    X, Menu, CheckCircle, Clock, BookOpenCheck, Calendar, Award, Eye, Play, Search
} from 'lucide-react';
import HomeContent from '../components/HomeContent';

const HomePage = () => {
    // 1. State
    const [activeMenu, setActiveMenu] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileData] = useState({
        name: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        phone: "0123456789",
        studentId: "SV2023001",
        birthDate: "1995-05-15",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        avatar: null
    });
    // Thêm các state khác nếu cần
    const [courses] = useState([
        {
            id: 1,
            name: "Python cơ bản",
            progress: 75,
            color: "bg-blue-500",
            instructor: "GV. Trần Văn A",
            lessons: 24,
            completedLessons: 18,
            duration: "6 tuần",
            description: "Học lập trình Python từ cơ bản đến nâng cao",
            nextLesson: "Bài 19: Xử lý ngoại lệ",
            lastAccessed: "2 giờ trước"
        },
        {
            id: 2,
            name: "Perl nâng cao",
            progress: 45,
            color: "bg-purple-500",
            instructor: "GV. Lê Thị B",
            lessons: 20,
            completedLessons: 9,
            duration: "4 tuần",
            description: "Nắm vững các kỹ thuật lập trình Perl nâng cao",
            nextLesson: "Bài 10: Biểu thức chính quy",
            lastAccessed: "1 ngày trước"
        }
    ]);
    const [assignments] = useState([
        {
            id: 1,
            title: "Thuật toán sắp xếp",
            course: "Python cơ bản",
            dueDate: "2025-06-25",
            status: "submitted",
            score: 85,
            maxScore: 100,
            submittedAt: "2025-06-20 14:30",
            feedback: "Bài làm tốt, cần cải thiện phần tối ưu thuật toán."
        },
        {
            id: 2,
            title: "Biểu thức chính quy",
            course: "Perl nâng cao",
            dueDate: "2025-06-28",
            status: "grading",
            submittedAt: "2025-06-22 16:45"
        },
        {
            id: 3,
            title: "Xử lý file và thư mục",
            course: "Python cơ bản",
            dueDate: "2025-06-30",
            status: "pending",
            description: "Viết chương trình xử lý file CSV và JSON"
        },
        {
            id: 4,
            title: "Module và Package",
            course: "Python cơ bản",
            dueDate: "2025-07-02",
            status: "not_started"
        }
    ]);

    const menuItems = [
        { id: 'home', label: 'Trang chủ', icon: Home },
        { id: 'courses', label: 'Khóa học', icon: BookOpen },
        { id: 'assignments', label: 'Bài tập', icon: FileText },
        { id: 'chatbot', label: 'Chatbot AI', icon: MessageCircle },
        { id: 'profile', label: 'Hồ sơ', icon: User },
        { id: 'settings', label: 'Cài đặt', icon: Settings }
    ];

    // 2. Hàm xử lý logic
    // ... (các hàm xử lý khác nếu có)

    // 3. Hàm renderContent
    const renderContent = () => {
        switch (activeMenu) {
            case 'home':
                return <HomeContent studentName={profileData.name} courses={courses} assignments={assignments} />;
            case 'courses':
                return (
                    <div>Khóa học (CoursesContent)</div>
                );
            case 'assignments':
                return (
                    <div>Bài tập (AssignmentsContent)</div>
                );
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
                menuItems={menuItems}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div className="flex-1 lg:ml-0">
                <TopBar
                    activeMenu={activeMenu}
                    menuItems={menuItems}
                    setSidebarOpen={setSidebarOpen}
                    studentName={profileData.name}
                />
                <div className="p-4 width-max">
                    {renderContent()}
                </div>
            </div>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default HomePage;