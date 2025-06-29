import React from "react";

const Sidebar = ({ sidebarItems, activeTab, setActiveTab, sidebarOpen, headerContent }) => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-sm border-r border-gray-200 transition-all duration-300`}>
        <div className="p-6">
            {headerContent ? (
                headerContent
            ) : (
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        {/* Có thể thêm icon/logo ở đây nếu muốn */}
                    </div>
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Hệ thống học tập</h1>
                            <p className="text-sm text-gray-600">Perl & Python</p>
                        </div>
                    )}
                </div>
            )}
        </div>
        <nav className="px-3">
            <ul className="space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    </div>
);

export default Sidebar; 