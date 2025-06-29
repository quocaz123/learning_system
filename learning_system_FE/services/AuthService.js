import axios from "./customize-axios"
import { jwtDecode } from "jwt-decode";

const loginAPI = (email, password) => {
    return axios.post("/login", { email, password });
}

const verifyOTP = (user_id, otp) => {
    return axios.post("/verify-otp", { user_id, otp })
}

const resendOTP = (user_id) => {
    return axios.post("/resend-otp", { user_id })
}

const getName = () => {
    const token = localStorage.getItem("token");
    if (token && typeof token === "string") {
        try {
            const payload = jwtDecode(token);
            return payload?.name || '';
        } catch (e) {
            console.log("Decode lỗi:", e);
        }
    }
    return '';
}

export { loginAPI, verifyOTP, resendOTP, getName };