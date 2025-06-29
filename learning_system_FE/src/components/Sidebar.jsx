import React from 'react';
import { X } from 'lucide-react';

const Sidebar = ({ menuItems, activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen }) => {
    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="flex items-center justify-between h-16 px-4 border-b">
                <h1 className="text-lg font-bold text-gray-800">Hệ thống học tập</h1>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                    <X size={24} />
                </button>
            </div>
            <nav className="mt-8">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveMenu(item.id);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors ${activeMenu === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                                }`}
                        >
                            <Icon size={20} className="mr-3" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
export default Sidebar;

