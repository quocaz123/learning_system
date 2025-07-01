import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem('access_token');

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    try {
        const payload = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < now) {
            return <Navigate to="/login" replace state={{ from: location }} />;
        }

        // Nếu được truyền allowedRoles thì kiểm tra role
        if (allowedRoles && !allowedRoles.includes(payload.role)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return <Outlet />;
    } catch (e) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
};

export default ProtectedRoute;
