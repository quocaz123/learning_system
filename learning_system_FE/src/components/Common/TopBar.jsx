import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { getName } from '../../../services/AuthService';

const TopBar = ({
    title,
    onMenuClick,
    rightContent
}) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const data = getName();
        if (data) {
            setUserInfo(data);
        }
    }, []);

    return (
        <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="mr-3">
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