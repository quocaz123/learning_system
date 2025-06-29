import LoginPage from './pages/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom';
import OTPPage from './pages/OTPPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';


function App() {

  return (
    <Routes>
      <Route path='/' element={<Navigate to="/login" replace />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/otp' element={<OTPPage />} />
      <Route path='/homepage' element={<HomePage />} />
      <Route path='/dashboard' element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
