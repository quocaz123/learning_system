import { Shield, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { verifyOTP, resendOTP } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const OTPPage = ({ userId, email, onBackToLogin }) => {
    const [formData, setFormData] = useState({
        user_id: userId,
        otp: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [timer, setTimer] = useState(120);
    const intervalRef = useRef(null);
    const navigate = useNavigate();
    const otpInputRef = useRef(null);

    // Quản lý countdown timer
    useEffect(() => {
        if (timer === 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [timer]);

    const handleOTPVerification = async (e) => {
        e.preventDefault();
        if (!validateOTP()) return;
        setIsLoading(true);
        try {
            const response = await verifyOTP(formData.user_id, formData.otp);

            if (response && response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                alert(' Đăng nhập thành công!');
                navigate('/home');
            } else {
                setErrors({ otp: response?.message || 'Mã OTP không đúng hoặc đã hết hạn' });
            }
        } catch (error) {
            setErrors({ otp: error?.message || 'Mã OTP không chính xác' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (timer > 0) return;
        setIsLoading(true);
        try {
            const response = await resendOTP(formData.user_id);
            if (response && response.message === 'OTP sent to email') {
                setFormData(prev => ({ ...prev, otp: '' }));
                setErrors({});
                setTimer(120);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                if (otpInputRef.current) {
                    otpInputRef.current.focus();
                }
                alert('Mã OTP mới đã được gửi đến email của bạn!');
            } else {
                alert(response?.message || 'Có lỗi xảy ra khi gửi lại OTP');
            }
        } catch {
            alert('Lỗi gửi lại OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setFormData(prev => ({ ...prev, otp: '' }));
        setErrors({});
        if (onBackToLogin) onBackToLogin();
    };

    const validateOTP = () => {
        const newErrors = {};
        if (!formData.otp) {
            newErrors.otp = 'Vui lòng nhập mã OTP';
        } else if (formData.otp.length !== 6) {
            newErrors.otp = 'Mã OTP phải có 6 chữ số';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="bg-white rounded-t-2xl shadow-xl border-t-4 border-green-500 p-8 text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="text-white text-2xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">XÁC THỰC OTP</h1>
                        <p className="text-gray-600">Nhập mã OTP đã được gửi đến email</p>
                        <p className="text-sm text-indigo-600 font-medium">{email}</p>
                    </div>
                </div>

                {/* OTP Form */}
                <div className="bg-white rounded-b-2xl shadow-xl p-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã OTP (6 chữ số)
                            </label>
                            <input
                                ref={otpInputRef}
                                type="text"
                                inputMode="numeric"
                                name="otp"
                                value={formData.otp || ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setFormData(prev => ({
                                        ...prev,
                                        otp: value
                                    }));
                                    if (errors.otp) {
                                        setErrors(prev => ({
                                            ...prev,
                                            otp: ''
                                        }));
                                    }
                                }}
                                maxLength={6}
                                className={`w-full px-4 py-3 border rounded-lg text-center text-2xl font-mono tracking-wider focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="000000"
                            />
                            {errors.otp && (
                                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                            )}
                        </div>

                        <div className="text-center text-gray-600 text-sm">
                            {timer > 0 ? (
                                <span>
                                    Thời gian còn lại: <span className="font-mono font-bold">{formatTime(timer)}</span>
                                </span>
                            ) : (
                                <span className="text-red-500">
                                    Hết thời gian! Vui lòng bấm "Gửi lại mã" để nhận OTP mới.
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleOTPVerification}
                                disabled={formData.otp.length !== 6 || isLoading || timer === 0}
                                className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${isLoading || timer === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang xác thực...
                                    </div>
                                ) : (
                                    'XÁC THỰC OTP'
                                )}
                            </button>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={handleBackToLogin}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Quay lại
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={timer > 0}
                                    className={`flex-1 ${timer > 0 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-indigo-700'} py-2 px-4 rounded-lg font-medium hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors`}
                                >
                                    Gửi lại mã
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6 text-gray-500 text-sm">
                    <p>© 2025 Hệ thống học tập. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </div>
    );
};

export default OTPPage;
