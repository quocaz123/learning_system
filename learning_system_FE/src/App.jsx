import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPPage from './pages/OTPPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp" element={<OTPPage />} />
      <Route path='/forgot_password' element={<ForgotPasswordPage />} />

      {/* Redirect root to login or a default page */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected Routes */}
      {/* Homepage for students and teachers */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'teacher']} />}>
        <Route path="/homepage" element={<HomePage />} />
      </Route>

      {/* Dashboard for admins */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Fallback for any other route - optional */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
