import axios from "./customize-axios";

const authHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createCourseAPI = (courseData) =>
    axios.post("/create-course", courseData, {
        headers: authHeader(),
    });

export const getAllCoursesAPI = () =>
    axios.get("/all_courses", {
        headers: authHeader(),
    });

export const getListCoursesAPI = () =>
        axios.get("/all-courses", {
            headers: authHeader(),
        });

export const enrollCourseAPI = (courseId) =>
    axios.post(`/courses/${courseId}/enroll`, {}, {
        headers: authHeader(),
    });

export const getMyCoursesAPI = () =>
    axios.get("/my-courses", {
        headers: authHeader(),
    });

export const getLessonDetailAPI = (lessonId) =>
    axios.get(`/lessons/${lessonId}`, {
        headers: authHeader(),
    });

export const completeLessonAPI = (userId, lessonId, courseId) =>
    axios.post('/lessons/complete', {
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
    }, {
        headers: authHeader(),
    });

export const getLessonsByCourseAPI = (courseId) =>
    axios.get(`/courses/${courseId}`, {
        headers: authHeader(),
    });

export const getStudentsByCourseAPI = (courseId) =>
    axios.get(`/courses/${courseId}/students`, {
        headers: authHeader(),
    });

export const deleteCourseAPI = (courseId) =>
    axios.delete(`/courses/${courseId}`, { headers: authHeader() });

export const updateCourseAPI = (courseId, courseData) =>
    axios.put(`/courses/${courseId}`, courseData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
    });
