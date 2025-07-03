import { BarChart3, BookOpen, FileText, Users, Upload, Download, Settings } from 'lucide-react';

// Sidebar items configuration
export const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'courses', label: 'Quản lý khóa học', icon: BookOpen },
  { id: 'assignments', label: 'Quản lý bài tập', icon: FileText },
  { id: 'students', label: 'Sinh viên', icon: Users },
  { id: 'upload', label: 'Tải lên tài liệu', icon: Upload },
  { id: 'reports', label: 'Báo cáo', icon: Download },
  { id: 'settings', label: 'Cài đặt', icon: Settings }
];

export const courses = [
  { id: 1, name: 'Perl Programming', students: 45, lessons: 12, assignments: 8, status: 'active' },
  { id: 2, name: 'Python Basics', students: 52, lessons: 15, assignments: 10, status: 'active' },
  { id: 3, name: 'Advanced Python', students: 28, lessons: 10, assignments: 6, status: 'draft' }
];

export const assignments = [
  { id: 1, title: 'Perl Variables & Data Types', course: 'Perl Programming', dueDate: '2025-07-10', submissions: 35, total: 45, status: 'active' },
  { id: 2, title: 'Python Functions', course: 'Python Basics', dueDate: '2025-07-08', submissions: 48, total: 52, status: 'active' },
  { id: 3, title: 'Object-Oriented Programming', course: 'Advanced Python', dueDate: '2025-07-15', submissions: 20, total: 28, status: 'draft' }
];

export const students = [
  { id: 1, name: 'Nguyễn Văn An', email: 'an.nv@student.dtu.edu.vn', course: 'Perl Programming', progress: 85, lastActive: '2025-07-02' },
  { id: 2, name: 'Trần Thị Bảo', email: 'bao.tt@student.dtu.edu.vn', course: 'Python Basics', progress: 92, lastActive: '2025-07-03' },
  { id: 3, name: 'Lê Minh Cường', email: 'cuong.lm@student.dtu.edu.vn', course: 'Advanced Python', progress: 78, lastActive: '2025-07-01' }
];


