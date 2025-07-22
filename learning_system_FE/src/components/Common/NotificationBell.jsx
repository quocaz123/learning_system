import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { NotificationService } from '../../../services/NotificationService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale'; // Import Vietnamese locale

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const [notifRes, countRes] = await Promise.all([
                NotificationService.getNotifications(),
                NotificationService.getUnreadCount(),
            ]);
            console.log('notifRes.data:', notifRes);
            console.log('countRes.data:', countRes);
            setNotifications(Array.isArray(notifRes) ? notifRes : []);
            setUnreadCount(
                typeof countRes?.unread_count === "number"
                    ? countRes.unread_count
                    : 0
            );
        } catch (error) {
            setNotifications([]);
            setUnreadCount(0);
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleBellClick = () => {
        setIsOpen(!isOpen);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await NotificationService.markAsRead(notificationId);
            fetchNotifications(); // Re-fetch to update the list and count
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await NotificationService.markAllAsRead();
            fetchNotifications(); // Re-fetch to update the list and count
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={handleBellClick} className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2 px-4 flex justify-between items-center border-b">
                        <h4 className="text-lg font-semibold">Thông báo</h4>
                        <button onClick={handleMarkAllAsRead} className="text-sm text-blue-500 hover:underline">
                            Đánh dấu tất cả là đã đọc
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {(!Array.isArray(notifications) || notifications.length === 0) ? (
                            <p className="text-gray-500 text-center py-4">Không có thông báo mới</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.notification_id} className={`p-4 border-b ${!n.is_read ? 'bg-blue-50' : ''}`}>
                                    <div>
                                        <p className="text-sm text-gray-800">{n.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDistanceToNow(new Date(n.sent_at), {
                                                addSuffix: true,
                                                locale: vi
                                            })}
                                        </p>
                                    </div>
                                    {!n.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(n.notification_id)}
                                            className="mt-2 text-xs text-blue-500 hover:underline"
                                        >
                                            Đánh dấu là đã đọc
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell; 