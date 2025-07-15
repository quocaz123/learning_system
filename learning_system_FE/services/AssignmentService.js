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

// Lấy toàn bộ testcase của một assignment
export const getAssignmentTestcasesAPI = (assignmentId) =>
    axios.get(`/assignments/${assignmentId}/testcases`, {
        headers: authHeader(),
    });

// Gửi code để test run với toàn bộ testcase (backend tự lấy testcase)
export const testRunAssignmentAPI = (assignmentId, code) =>
    axios.post(`/assignments/${assignmentId}/test-run`, { code }, {
        headers: authHeader(),
    });

const getMyAssignments = () => axios.get('/my-assignments');
const getRecentLogs = () => axios.get('/logs/recent', { headers: authHeader() });
const getStatusAssignment = () => axios.get('/my-assignments/statistics', { headers: authHeader() });

const AssignmentService = {
    getMyAssignments,
    submitAssignmentAPI,
    getStatusAssignment,
    getRecentLogs,
};

export default AssignmentService;