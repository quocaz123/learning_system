import React from 'react';
import { Menu } from 'lucide-react';
import { getName } from "../../services/AuthService"

const Topbar = ({ activeMenu, menuItems, setSidebarOpen }) => {
    return (
        <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(true)} className="mr-3">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">
                    {activeMenu === 'home' ? 'DASHBOARD' : menuItems.find(item => item.id === activeMenu)?.label.toUpperCase()}
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                    Xin chào, <span className="font-medium">{getName()}</span>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                        {(() => {
                            const name = getName();
                            return (typeof name === 'string' && name.trim() !== '')
                                ? name.split(' ').map(n => n[0]).join('')
                                : '';
                        })()}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Topbar;
