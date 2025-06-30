import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
});

// Gắn access_token vào header cho mọi request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý tự động refresh token khi access_token hết hạn
instance.interceptors.response.use(
    function (response) {
        return response.data ? response.data : { statusCode: response.status };
    },
    async function (error) {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token");
                const res = await axios.post("http://127.0.0.1:5000/refresh", {
                    refresh_token: refreshToken
                });
                const { access_token, refresh_token } = res.data;
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return instance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance