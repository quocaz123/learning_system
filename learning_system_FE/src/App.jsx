import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPPage from './pages/OTPPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPage';
import UserProfileContent from './components/Student/UserProfileContent';
import Unauthorized from './pages/Unauthorized';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp" element={<OTPPage />} />
      <Route path="/forgot_password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/reset_password" element={<ResetPasswordPage />} />
      <Route path="/teacher_dashboard" element={<TeacherDashboard />} />

      {/* Protected routes for student & teacher */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'teacher']} />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<UserProfileContent />} />
      </Route>

      {/* Protected route for admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
