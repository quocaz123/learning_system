import customizeAxios from "./customize-axios";


const authHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getNotifications = () => {
    return customizeAxios.get("/notifications", { headers: authHeader() });
};

const getUnreadCount = () => {
    return customizeAxios.get("/notifications/unread-count", { headers: authHeader() });
};

const markAsRead = (notificationId) => {
    return customizeAxios.post(`/notifications/${notificationId}/read`, {}, { headers: authHeader() });
};

const markAllAsRead = () => {
    return customizeAxios.post("/notifications/read-all", {}, { headers: authHeader() });
};

export const NotificationService = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
}; 