import axios from "./customize-axios";


const authHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createAssignmentAPI = (data) =>
    axios.post("/assignments", data, {
        headers: authHeader(),
    });

export const updateAssignmentAPI = (assignmentId, data) =>
    axios.put(`/assignments/${assignmentId}`, data, {
        headers: authHeader(),
    });

export const getAssignmentsAPI = (page, perPage) =>
    axios.get(`/assignments?page=${page}&per_page=${perPage}`, {
        headers: authHeader(),
    });

export const deleteAssignmentAPI = (assignmentId) =>
    axios.delete(`/assignments/${assignmentId}`, {
        headers: authHeader(),
    });

export const getCoursesByUserAPI = () =>
    axios.get('/courses', {
        headers: authHeader(),
    });

export const getLessonByCourseIdAPI = (courseId) =>
    axios.get(`/courses/${courseId}`);

export const getAssignmentsForStudentAPI = (courseId) =>
    axios.get(`/assignments/student?course_id=${courseId}`, {
        headers: authHeader(),
    });

export const submitAssignmentAPI = (assignmentId, data) =>
    axios.post(`/assignments/${assignmentId}/submit`, data, {
        headers: authHeader(),
    });

const getMyAssignments = () => axios.get('/my-assignments');

const AssignmentService = {
    getMyAssignments,
};

export default AssignmentService;