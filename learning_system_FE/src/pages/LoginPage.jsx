import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { loginAPI } from '../../services/AuthService';
import OTPPage from './OTPPage';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [userId, setUserId] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const res = await loginAPI(formData.email, formData.password);
            console.log('Kết quả trả về từ API:', res);
            if (res && res.access_token) {
                localStorage.setItem('access_token', res.access_token);
                localStorage.setItem('refresh_token', res.refresh_token);
                localStorage.setItem('user_role', res.role);

                alert('Đăng nhập thành công!');

                if (res.role === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/homepage');
                }
            } else if (res && res.need_2fa) {
                setUserId(res.user_id);
                setShowOTP(true);
            } else {
                alert(res?.message || 'Đăng nhập thất bại! Dữ liệu trả về không hợp lệ.');
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            const errorMessage = error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.';
            alert(`Đăng nhập thất bại: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = () => {
        navigate('/register')
    };

    const handleForgotPassword = () => {
        navigate('/forgot_password');
    };

    // Nếu đang ở bước OTP thì render OTPPage
    if (showOTP) {
        return <OTPPage userId={userId} email={formData.email} onBackToLogin={() => setShowOTP(false)} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="bg-white rounded-t-2xl shadow-xl border-t-4 border-indigo-500 p-8 text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">HT</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">HỆ THỐNG HỌC TẬP</h1>
                        <p className="text-gray-600">Đăng nhập hoặc Tạo tài khoản mới</p>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-b-2xl shadow-xl p-8">
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Nhập email của bạn"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Nhập mật khẩu"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className={`flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    'ĐĂNG NHẬP'
                                )}
                            </button>

                            <button
                                onClick={handleRegister}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                ĐĂNG KÝ
                            </button>
                        </div>

                        {/* Forgot Password */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-gray-500 text-sm">
                    <p>© 2025 Hệ thống học tập. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;