import axios from "./customize-axios";

const authHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminUserService = {
  getAllUsers: async () => {
    return await axios.get("/admin/users", { headers: authHeader() });
  },
  addUser: async (data) => {
    return await axios.post("/admin/users", data, { headers: authHeader() });
  },
  updateUser: async (id, data) => {
    return await axios.put(`/admin/users/${id}`, data, { headers: authHeader() });
  },
  deleteUser: async (id) => {
    return await axios.delete(`/admin/users/${id}`, { headers: authHeader() });
  },
  getStatistics: async () => {
    return await axios.get("/admin/report-statistics", { headers: authHeader() });
  }, getSummary: async () => {
    return await axios.get("/dashboard/summary", { headers: authHeader() });
  },
  getRecentActivities: async () => {
    return await axios.get("/dashboard/recent-activities", { headers: authHeader() });
  },
};

export default AdminUserService; 