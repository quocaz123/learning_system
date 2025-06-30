import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');

    // 1. Kiểm tra nếu người dùng chưa đăng nhập
    if (!token) {
        // Chuyển hướng về trang đăng nhập và lưu lại trang họ đang cố truy cập
        return <Navigate to="/login" replace />;
    }

    // 2. Kiểm tra nếu vai trò của người dùng không được phép
    // `allowedRoles` là một mảng các vai trò được phép, ví dụ: ['admin', 'teacher']
    if (!allowedRoles || !allowedRoles.includes(userRole)) {
        // Thông báo cho người dùng và chuyển hướng họ về trang an toàn
        alert('Bạn không có quyền truy cập trang này.');

        // Chuyển hướng về trang chính dựa trên vai trò của họ để tránh bị kẹt
        if (userRole === 'admin') {
            return <Navigate to="/dashboard" replace />;
        }
        // Mặc định cho student, teacher về homepage
        return <Navigate to="/homepage" replace />;
    }

    // 3. Nếu đã đăng nhập và có quyền, hiển thị trang yêu cầu
    return <Outlet />;
};

export default ProtectedRoute; 