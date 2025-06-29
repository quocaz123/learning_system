import React, { useState, useRef } from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Edit,
    Save,
    X,
    Eye,
    EyeOff,
    Shield,
    Smartphone,
    Key,
    CheckCircle,
    AlertCircle,
    Camera,
    Upload,
    Copy,
    QrCode,
    RefreshCw
} from 'lucide-react';
import { twoFAData } from '../../data/student/user';

const UserProfileSystem = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const fileInputRef = useRef(null);


    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        joinDate: '',
        address: '',
        bio: '',
        avatar: '',
        position: '',
        department: '',
        // ... các trường khác nếu có
    });

    // Handle profile update
    const handleProfileUpdate = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle avatar upload
    const handleAvatarUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle password change
    const handlePasswordChange = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            alert('Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }
        alert('Đổi mật khẩu thành công!');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    // Handle 2FA setup
    const handleTwoFASetup = async () => {
        setIsVerifying(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (verificationCode === '123456') { // Mock verification
            setTwoFAEnabled(true);
            setShowQRCode(false);
            setVerificationCode('');
            alert('2FA đã được kích hoạt thành công!');
        } else {
            alert('Mã xác thực không đúng!');
        }
        setIsVerifying(false);
    };

    // Copy to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Đã sao chép vào clipboard!');
    };

    // Profile Tab Component
    const ProfileTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isEditing
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {isEditing ? (
                        <>
                            <X className="w-4 h-4" />
                            Hủy
                        </>
                    ) : (
                        <>
                            <Edit className="w-4 h-4" />
                            Chỉnh sửa
                        </>
                    )}
                </button>
            </div>

            <div className="bg-white border rounded-lg p-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                        {profileData.avatar && (
                            <img
                                src={profileData.avatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                            />
                        )}
                        {isEditing && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h4>
                        <p className="text-gray-600">{profileData.position}</p>
                        <p className="text-sm text-gray-500">{profileData.department}</p>
                    </div>
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            Họ
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profileData.firstName}
                                onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-lg">{profileData.firstName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            Tên
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profileData.lastName}
                                onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-lg">{profileData.lastName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleProfileUpdate('email', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-lg">{profileData.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Số điện thoại
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-lg">{profileData.phone}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Ngày sinh
                        </label>
                        {isEditing ? (
                            <input
                                type="date"
                                value={profileData.birthDate}
                                onChange={(e) => handleProfileUpdate('birthDate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-lg">{new Date(profileData.birthDate).toLocaleDateString('vi-VN')}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày vào làm
                        </label>
                        <p className="px-3 py-2 bg-gray-50 rounded-lg">{new Date(profileData.joinDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Địa chỉ
                    </label>
                    {isEditing ? (
                        <textarea
                            value={profileData.address}
                            onChange={(e) => handleProfileUpdate('address', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg">{profileData.address}</p>
                    )}
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiểu sử
                    </label>
                    {isEditing ? (
                        <textarea
                            value={profileData.bio}
                            onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg">{profileData.bio}</p>
                    )}
                </div>

                {isEditing && (
                    <div className="mt-6 flex gap-2">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                alert('Cập nhật thông tin thành công!');
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Lưu thay đổi
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Security Tab Component
    const SecurityTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Bảo mật tài khoản</h3>

            {/* Change Password Section */}
            <div className="bg-white border rounded-lg p-6">
                <h4 className="text-md font-semibold mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Đổi mật khẩu
                </h4>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                    ...prev,
                                    currentPassword: e.target.value
                                }))}
                                className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                    ...prev,
                                    newPassword: e.target.value
                                }))}
                                className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                    ...prev,
                                    confirmPassword: e.target.value
                                }))}
                                className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Xác nhận mật khẩu mới"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handlePasswordChange}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Đổi mật khẩu
                    </button>
                </div>
            </div>

            {/* Two-Factor Authentication Section */}
            <div className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Xác thực hai yếu tố (2FA)
                    </h4>
                    <div className={`px-3 py-1 rounded-full text-sm ${twoFAEnabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {twoFAEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                    </div>
                </div>

                <p className="text-gray-600 mb-4">
                    Xác thực hai yếu tố giúp bảo vệ tài khoản của bạn bằng cách yêu cầu mã xác thác từ ứng dụng di động.
                </p>

                {!twoFAEnabled ? (
                    <div className="space-y-4">
                        <button
                            onClick={() => setShowQRCode(true)}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <Smartphone className="w-4 h-4" />
                            Kích hoạt 2FA
                        </button>

                        {showQRCode && (
                            <div className="border-t pt-4">
                                <h5 className="font-medium mb-3">Thiết lập 2FA</h5>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            1. Tải ứng dụng xác thực như Google Authenticator hoặc Authy
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            2. Quét mã QR này hoặc nhập mã thủ công:
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <QrCode className="w-32 h-32 text-gray-400" />
                                            <p className="text-center text-xs mt-2">QR Code</p>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mã thiết lập thủ công:
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                    {twoFAData.secret}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(twoFAData.secret)}
                                                    className="p-1 text-gray-500 hover:text-gray-700"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            3. Nhập mã xác thực từ ứng dụng:
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                placeholder="Nhập 6 chữ số"
                                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                maxLength={6}
                                            />
                                            <button
                                                onClick={handleTwoFASetup}
                                                disabled={isVerifying || verificationCode.length !== 6}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isVerifying ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                                Xác nhận
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span>2FA đã được kích hoạt thành công</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h6 className="font-medium mb-2">Mã dự phòng</h6>
                            <p className="text-sm text-gray-600 mb-3">
                                Lưu các mã này ở nơi an toàn. Bạn có thể sử dụng chúng để đăng nhập khi không có điện thoại.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {twoFAData.backupCodes.map((code, index) => (
                                    <code key={index} className="bg-white px-2 py-1 rounded text-sm">
                                        {code}
                                    </code>
                                ))}
                            </div>
                            <button
                                onClick={() => copyToClipboard(twoFAData.backupCodes.join(', '))}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                <Copy className="w-3 h-3" />
                                Sao chép tất cả
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                if (confirm('Bạn có chắc muốn tắt 2FA?')) {
                                    setTwoFAEnabled(false);
                                    alert('2FA đã được tắt');
                                }
                            }}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Tắt 2FA
                        </button>
                    </div>
                )}
            </div>

            {/* Security Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                        <h5 className="font-medium text-yellow-800">Mẹo bảo mật</h5>
                        <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                            <li>• Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
                            <li>• Kích hoạt xác thực hai yếu tố để tăng cường bảo mật</li>
                            <li>• Không chia sẻ thông tin đăng nhập với ai</li>
                            <li>• Đăng xuất sau khi sử dụng trên máy tính chung</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Hồ sơ cá nhân</h1>
                <p className="text-gray-600">Quản lý thông tin cá nhân và cài đặt bảo mật</p>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <User className="w-4 h-4 inline mr-2" />
                        Thông tin cá nhân
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'security'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Shield className="w-4 h-4 inline mr-2" />
                        Bảo mật
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'security' && <SecurityTab />}
            </div>
        </div>
    );
};

export default UserProfileSystem;