import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const TopBar = ({ title, onMenuClick, rightContent, userInfo: userInfoProp }) => {
    // Cho phép truyền userInfo từ props, nếu không có thì mặc định là Giảng viên
    const [userInfo] = useState(userInfoProp || { fullName: 'Giảng viên' });

    return (
        <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                {rightContent}
                {userInfo && (
                    <>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{userInfo.fullName}</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                            <span className="text-white text-sm font-medium">{userInfo.fullName?.[0]?.toUpperCase()}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TopBar; 