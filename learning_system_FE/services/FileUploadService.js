import axios from './customize-axios';

export const uploadFileAPI = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}; 