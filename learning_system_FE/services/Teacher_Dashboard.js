import axios from "./customize-axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

export const exportToExcel = (students, courseName) => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileName = `Danh_sach_sinh_vien_${courseName}.xlsx`;
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
};