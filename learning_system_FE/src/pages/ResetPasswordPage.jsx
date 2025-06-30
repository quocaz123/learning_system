import React, { useState, useEffect } from 'react';

const ResetPasswordPage = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [token, setToken] = useState('');
    const [isValidToken, setIsValidToken] = useState(true);

    // Lấy token từ URL khi component mount
    useEffect(() => {
        // Giả lập lấy token từ URL params
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('token') || 'demo-token-123';
        setToken(resetToken);

        // Kiểm tra token hợp lệ
        validateToken(resetToken);
    }, []);

    const validateToken = async (token) => {
        try {
            // Giả lập API call kiểm tra token
            // const response = await validateResetTokenAPI(token);
            // setIsValidToken(response.valid);

            // Demo: token hợp lệ
            setIsValidToken(true);
        } catch (error) {
            setIsValidToken(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Demo success
            setIsSuccess(true);

            // Thực tế sẽ gọi API:
            // const response = await resetPasswordAPI(token, formData.password);
            // if (response.success) {
            //     setIsSuccess(true);
            // } else {
            //     setErrors({ general: response.message });
            // }
        } catch (error) {
            console.error('Lỗi đặt lại mật khẩu:', error);
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu mới';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Xóa lỗi khi user nhập
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBackToLogin = () => {
        console.log('Chuyển về trang đăng nhập');
        // navigate('/login');
    };

    // Lock Icon SVG
    const LockIcon = () => (
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );

    // Eye Icon SVG
    const EyeIcon = () => (
        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    // Eye Off Icon SVG
    const EyeOffIcon = () => (
        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
    );

    // Check Circle Icon SVG
    const CheckCircleIcon = () => (
        <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    // X Circle Icon SVG (for invalid token)
    const XCircleIcon = () => (
        <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    // Nếu token không hợp lệ
    if (!isValidToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-red-500 p-8 text-center">
                        <XCircleIcon />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 mt-4">Liên kết không hợp lệ</h1>
                        <p className="text-gray-600 mb-6">
                            Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.
                        </p>
                        <button
                            onClick={handleBackToLogin}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        );
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">ĐẶT LẠI MẬT KHẨU</h1>
                        <p className="text-gray-600">
                            {isSuccess
                                ? 'Mật khẩu đã được cập nhật thành công!'
                                : 'Nhập mật khẩu mới cho tài khoản của bạn'
                            }
                        </p>
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-b-2xl shadow-xl p-8">
                    {!isSuccess ? (
                        <div className="space-y-6">
                            {/* General Error */}
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-800 text-sm">{errors.general}</p>
                                </div>
                            )}

                            {/* New Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockIcon />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập mật khẩu mới"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockIcon />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập lại mật khẩu mới"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
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
                                        Đang cập nhật...
                                    </div>
                                ) : (
                                    'CẬP NHẬT MẬT KHẨU'
                                )}
                            </button>

                            {/* Back to Login */}
                            <button
                                onClick={handleBackToLogin}
                                className="w-full text-indigo-600 hover:text-indigo-800 py-2 transition-colors"
                            >
                                Quay lại đăng nhập
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
                                    Cập nhật thành công!
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Mật khẩu của bạn đã được cập nhật thành công.
                                    Bạn có thể đăng nhập bằng mật khẩu mới.
                                </p>
                            </div>

                            <button
                                onClick={handleBackToLogin}
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                            >
                                ĐĂNG NHẬP NGAY
                            </button>
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

export default ResetPasswordPage;