import React from 'react';
import { Menu } from 'lucide-react';

const TopBar = ({
    title,
    onMenuClick,
    userName,
    userEmail,
    avatar,
    rightContent
}) => (
    <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
            <button onClick={onMenuClick} className="mr-3">
                <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
            {rightContent}
            <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                {userEmail && <p className="text-xs text-gray-600">{userEmail}</p>}
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                {avatar
                    ? <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    : <span className="text-white text-sm font-medium">{userName?.[0]}</span>
                }
            </div>
        </div>
    </div>
);

export default TopBar; 