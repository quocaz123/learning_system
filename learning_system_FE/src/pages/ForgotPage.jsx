import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!validateEmail()) return;

        setIsLoading(true);
        setError('');

        try {
            // Gọi API thực tế
            await axios.post('http://127.0.0.1:5000/forgot-password', { email });
            setIsSuccess(true);
        } catch (error) {
            setError(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    };

    const validateEmail = () => {
        if (!email) {
            setError('Vui lòng nhập email');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email không hợp lệ');
            return false;
        }

        setError('');
        return true;
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) {
            setError('');
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleResendEmail = () => {
        setIsSuccess(false);
        handleSubmit({ preventDefault: () => { } });
    };

    // Mail Icon SVG
    const MailIcon = () => (
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );

    // Arrow Left Icon SVG
    const ArrowLeftIcon = () => (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    );

    // Check Circle Icon SVG
    const CheckCircleIcon = () => (
        <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="bg-white rounded-t-2xl shadow-xl border-t-4 border-indigo-500 p-8 text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">HT</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">QUÊN MẬT KHẨU</h1>
                        <p className="text-gray-600">
                            {isSuccess
                                ? 'Email đã được gửi thành công'
                                : 'Nhập email để nhận liên kết đặt lại mật khẩu'
                            }
                        </p>
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-b-2xl shadow-xl p-8">
                    {!isSuccess ? (
                        <div className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MailIcon />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${error ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập email của bạn"
                                        disabled={isLoading}
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang gửi...
                                    </div>
                                ) : (
                                    'GỬI EMAIL ĐẶT LẠI MẬT KHẨU'
                                )}
                            </button>

                            {/* Back to Login */}
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                className="w-full flex items-center justify-center space-x-2 text-indigo-600 hover:text-indigo-800 py-2 transition-colors"
                            >
                                <ArrowLeftIcon />
                                <span>Quay lại đăng nhập</span>
                            </button>
                        </div>
                    ) : (
                        /* Success State */
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <CheckCircleIcon />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Email đã được gửi!
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email:
                                </p>
                                <p className="font-medium text-indigo-600">{email}</p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Lưu ý:</strong> Vui lòng kiểm tra cả thư mục spam/junk nếu không thấy email trong hộp thư đến.
                                    Liên kết sẽ hết hạn sau 30 phút.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleResendEmail}
                                    disabled={isLoading}
                                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                >
                                    Gửi lại email
                                </button>

                                <button
                                    onClick={handleBackToLogin}
                                    className="w-full flex items-center justify-center space-x-2 text-indigo-600 hover:text-indigo-800 py-2 transition-colors"
                                >
                                    <ArrowLeftIcon />
                                    <span>Quay lại đăng nhập</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-gray-500 text-sm">
                    <p>© 2025 Hệ thống học tập. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;