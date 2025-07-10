import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPPage from './pages/OTPPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPage';
import UserProfileContent from './components/Student/UserProfileContent';
import Unauthorized from './pages/Unauthorized';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TeacherDashboard from './pages/TeacherDashboard';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourseContent from './components/Student/CourseContent';
import HomePage from './pages/HomePage';
function App() {
  return (
    <>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/forgot_password" element={<ForgotPasswordPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/reset_password" element={<ResetPasswordPage />} />
        <Route path='/content' element={<CourseContent />} />
        <Route path="/home" element={<HomePage />} />


        {/* Protected routes for student & teacher */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'student', 'teacher']} />}>
          <Route path="/profile" element={<UserProfileContent />} />
          <Route path="/teacher_dashboard" element={<TeacherDashboard />} />
        </Route>

        {/* Protected route for admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
