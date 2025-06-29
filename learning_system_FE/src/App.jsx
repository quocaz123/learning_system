import LoginPage from './pages/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom';
import OTPPage from './pages/OTPPage';
import HomePage from './pages/HomePage';
import Dashboard from './components/Dashboard';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Navigate to="/login" replace />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/otp' element={<OTPPage />} />
      <Route path='/homepage' element={<HomePage />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )
}

export default App
