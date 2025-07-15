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
        title: "Python for Beginners",
        language: "Python",
        author: "Lê Văn C",
        enrolled: true,
        progress: 30,
        color: "bg-blue-500",
        instructor: "GV. Trần Văn A",
        lessons: 10,
        completedLessons: 3,
        duration: "6 tuần",
        description: "Introduction to Python programming",
        nextLesson: "Bài 19: Xử lý ngoại lệ",
        lastAccessed: "2 giờ trước"
    },
    {
        id: 2,
        name: "Perl nâng cao",
        title: "Nắm vững các kỹ thuật lập trình Perl nâng cao",
        language: "Perl",
        author: "Nguyễn Văn B",
        enrolled: false,
        progress: 0,
        color: "bg-purple-500",
        instructor: "GV. Lê Thị B",
        lessons: 20,
        completedLessons: 0,
        duration: "4 tuần",
        description: "Học lập trình Perl từ cơ bản đến nâng cao",
        nextLesson: "Bài 10: Biểu thức chính quy",
        lastAccessed: "1 ngày trước"
    },
    {
        id: 3,
        name: "JavaScript cơ bản",
        title: "JavaScript Fundamentals",
        language: "JavaScript",
        author: "Nguyễn Văn A",
        enrolled: false,
        progress: 0,
        color: "bg-yellow-500",
        instructor: "GV. Nguyễn Văn A",
        lessons: 12,
        completedLessons: 0,
        duration: "5 tuần",
        description: "Learn the basics of JavaScript programming language",
        nextLesson: "Bài 1: Giới thiệu JavaScript",
        lastAccessed: "3 ngày trước"
    },
    {
        id: 4,
        name: "React nâng cao",
        title: "React Development",
        language: "JavaScript",
        author: "Trần Thị B",
        enrolled: true,
        progress: 60,
        color: "bg-cyan-500",
        instructor: "GV. Trần Thị B",
        lessons: 15,
        completedLessons: 9,
        duration: "7 tuần",
        description: "Build modern web applications with React.",
        nextLesson: "Bài 10: React Hooks",
        lastAccessed: "5 giờ trước"
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
    { id: 'profile', label: 'Hồ sơ & Cài đặt', icon: Settings },
]; 