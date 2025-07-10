import axios from "./customize-axios";

const authHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllCoursesAPI = () =>
    axios.get("/all_courses", {
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
