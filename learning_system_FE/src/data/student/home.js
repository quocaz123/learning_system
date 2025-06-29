// home.js - mock data for HomePage

import { Home, BookOpen, FileText, MessageCircle, User, Settings } from 'lucide-react';

export const profileData = {
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0123456789",
    studentId: "SV2023001",
    birthDate: "1995-05-15",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    avatar: null
};

export const courses = [
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
];

export const assignments = [
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
];

export const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'courses', label: 'Khóa học', icon: BookOpen },
    { id: 'assignments', label: 'Bài tập', icon: FileText },
    { id: 'chatbot', label: 'Chatbot AI', icon: MessageCircle },
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
]; 