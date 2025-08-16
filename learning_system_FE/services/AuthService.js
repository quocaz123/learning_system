import axios from "./customize-axios";
import { jwtDecode } from "jwt-decode";

const authHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginAPI = (email, password) =>
    axios.post("/login", { email, password });

export const registerAPI = (data) =>
    axios.post("/register", data);

export const verifyOTP = (user_id, otp) =>
    axios.post("/verify-otp", { user_id, otp });

export const resendOTP = (user_id) =>
    axios.post("/resend-otp", { user_id });

export const updateProfileAPI = async (data) => {
    try {
        return await axios.post("/profile", data, {
            headers: authHeader(),
        });
    } catch (e) {
        console.error("Lỗi update profile:", e.response?.data || e.message);
        return null;
    }
};

export const getProfileAPI = async () => {
    try {
        return await axios.get("/profile", {
            headers: authHeader(),
        });
    } catch (e) {
        console.error("Lỗi get profile:", e.response?.data || e.message);
        return null;
    }
};

export const getName = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    try {
        const payload = jwtDecode(token);
        return {
            fullName: payload?.name || '',
            role: payload?.role || '',
        };
    } catch (e) {
        console.error("Lỗi giải mã token:", e);
        return null;
    }
};

export const toggle2FAAPI = async (enable) => {
    const response = await axios.post(
        '/2fa/toggle',
        { enable_2fa: enable },
        {
            headers: authHeader(),
            withCredentials: true
        }
    );
    if (response && response.access_token) {
        localStorage.setItem('access_token', response.access_token);
    }
    console.log('toggle2FAAPI raw response:', response.access_token);

    return response;
};

export const changePasswordAPI = async (data) => {
    return await axios.post("/change-password", data, {
        headers: authHeader(),
    });
};

export const logoutAPI = () => axios.post('/logout');
