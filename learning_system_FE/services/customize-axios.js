import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
});

instance.interceptors.response.use(function (response) {
    return response.data ? response.data : { statusCode: response.status };
}, function (error) {
    return Promise.reject(error);
});

export default instance