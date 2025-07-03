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
