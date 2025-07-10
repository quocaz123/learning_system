
import { Menu } from 'lucide-react';

const TopBar = ({ title, onMenuClick, rightContent, studentName, role }) => {
    // Cho phép truyền userInfo từ props, nếu không có thì mặc định là Giảng viên

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
                {studentName && (
                    <>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {role && role[0].toUpperCase() + role.slice(1).toLowerCase()}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                            <span className="text-white text-sm font-medium">{studentName?.[0]?.toUpperCase()}</span>
                        </div>
                    </>
                )}
                {studentName && (
                    <span className="ml-4 font-semibold text-blue-700">{studentName}!</span>
                )}
            </div>
        </div>
    );
};

export default TopBar; 