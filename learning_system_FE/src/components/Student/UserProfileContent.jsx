import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
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
    Copy,
} from 'lucide-react';
import { twoFAData } from '../../data/student/user';
import { updateProfileAPI, getProfileAPI } from '../../../services/AuthService';


const UserProfileSystem = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const fileInputRef = useRef(null);


    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [profileData, setProfileData] = useState({
        full_name: '',
        email: '',
        phone: '',
        birthDate: '',
        bio: '',
        avatar: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfileAPI();
                setTwoFAEnabled(res?.twofa_enabled || false);
                if (res && res) {

                    // Nếu backend trả birth_date dạng DD/MM/YYYY thì chuyển về dạng input
                    let birthDate = res.birth_date;
                    if (birthDate && birthDate.includes('/')) {
                        const [day, month, year] = birthDate.split('/');
                        birthDate = `${year}-${month}-${day}`;
                    }

                    setProfileData(prev => ({
                        ...prev,
                        full_name: res.full_name || '',
                        email: res.email || '',
                        phone: res.phone || '',
                        birthDate: birthDate || '',
                        avatar: res.avatar_url || '',
                        bio: res.bio || ''
                    }));
                }
            } catch {
                // Xử lý lỗi nếu cần
            }
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async () => {
        let dataToSend = { ...profileData };
        if (dataToSend.birthDate && dataToSend.birthDate.includes('/')) {
            // Nếu birthDate là dạng DD/MM/YYYY thì chuyển về YYYY-MM-DD
            const [day, month, year] = dataToSend.birthDate.split('/');
            dataToSend.birthDate = `${year}-${month}-${day}`;
        }
        try {
            await updateProfileAPI(dataToSend);
            alert('Cập nhật hồ sơ thành công!');
            setIsEditing(false);
        } catch {
            // alert('Cập nhật thất bại!');
        }
    };

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

                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            Họ và tên
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profileData.full_name}
                                onChange={(e) => handleProfileUpdate('full_name', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-lg">{profileData.full_name}</p>
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
                            onClick={handleSaveProfile}
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