import axios from "./customize-axios";

const authHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getStatsAPI = async () => {
    try {
        return await axios.get("/teacher/dashboard-stats", {
            headers: authHeader()
        })
    } catch (e) {
        console.error("Lỗi get profile:", e.response?.data || e.message);
        return null;
    }
}

export const getLogsAPI = async () => {
    try {
        return await axios.get("/teacher/student-logs", {
            headers: authHeader()
        })
    } catch (e) {
        console.error("Lỗi get profile:", e.response?.data || e.message);
        return null;
    }
}

export const getRecentSubmissionsAPI = async () => {
    try {
        return await axios.get("/teacher/recent-submissions", {
            headers: authHeader()
        })
    } catch (e) {
        console.error("Lỗi get recent submissions:", e.response?.data || e.message);
        return null;
    }
}