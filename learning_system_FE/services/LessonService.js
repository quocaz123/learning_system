import axios from "./customize-axios";

const authHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createLessonAPI = (lessonData) =>
    axios.post("/create-lesson", lessonData, {
        headers: authHeader(),
    });

export const updateLessonAPI = (lessonId, lessonData) =>
    axios.put(`/lessons/${lessonId}`, lessonData, {
        headers: authHeader(),
    });

export const getLessonByIdAPI = (lessonId) =>
    axios.get(`/lessons/${lessonId}`, {
        headers: authHeader(),
    }); 