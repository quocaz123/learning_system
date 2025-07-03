import { Code, FileQuestion, Upload, Layers } from 'lucide-react';

export const lessons = [
    { id: 1, name: 'Bài 1: Giới thiệu Python' },
    { id: 2, name: 'Bài 2: Biến và kiểu dữ liệu' },
    { id: 3, name: 'Bài 3: Vòng lặp và điều kiện' },
    { id: 4, name: 'Bài 4: Hàm và module' }
];

export const exerciseTypes = [
    { value: 'code', label: 'Lập trình', icon: Code, color: 'text-blue-600 bg-blue-50' },
    { value: 'quiz', label: 'Trắc nghiệm', icon: FileQuestion, color: 'text-green-600 bg-green-50' },
    { value: 'upload', label: 'Nộp file', icon: Upload, color: 'text-purple-600 bg-purple-50' },
    { value: 'mixed', label: 'Tổng hợp', icon: Layers, color: 'text-orange-600 bg-orange-50' }
];

export const courses = [
    { id: 1, name: 'Perl Programming' },
    { id: 2, name: 'Python Basics' },
    { id: 3, name: 'Advanced Python' }
  ];