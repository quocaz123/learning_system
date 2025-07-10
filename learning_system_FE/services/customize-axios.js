import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    withCredentials: true, // Để gửi cookie khi gọi API
});

function isTokenExpiringSoon(token, thresholdSeconds = 60) {
    if (!token) return true;
    try {
        const { exp } = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return exp - now < thresholdSeconds;
    } catch {
        return true;
    }
}

instance.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem("access_token");
        // Nếu chưa đăng nhập thì không cần kiểm tra token
        if (!token) {
            return config;
        }
        if (isTokenExpiringSoon(token)) {
            // Gọi refresh, backend sẽ lấy refresh_token từ cookie
            try {
                const res = await axios.post("http://127.0.0.1:5000/refresh", {}, { withCredentials: true });
                token = res.access_token;
                localStorage.setItem("access_token", token);
            } catch (e) {
                localStorage.removeItem("access_token");
                window.location.href = "/login";
                throw e;
            }
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý response giữ nguyên như cũ
instance.interceptors.response.use(
    function (response) {
        return response.data ? response.data : { statusCode: response.status };
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance