import axios from "./customize-axios";

function cleanCompletion(completion) {
  // Loại bỏ markdown
  let code = completion
    .replace(/```python\n?/g, "")
    .replace(/```/g, "")
    .trim();

  // Loại bỏ docstring đầu hàm (""" ... """)
  code = code.replace(/"""[\s\S]*?"""/g, "");

  // Loại bỏ dòng trống thừa
  code = code.replace(/^\s*\n/gm, "");

  return code.trim();
}

const authHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCodeCompletion = async (code) => {
  const res = await fetch("http://127.0.0.1:5000/lmstudio/completion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  // Xử lý completion trước khi trả về
  return cleanCompletion(data.completion);
};

// Gửi câu hỏi tới Gemini Chatbot
export const sendChatGemini = async (question) => {
  const res = await axios.post("/chat/ask", { question });
  return res;
};

// Lấy lịch sử chat Gemini
export const getChatHistoryGemini = async () => {
  const res = await axios.get("/chat/history");
  return res;
};

// Xóa lịch sử chat Gemini
export const deleteChatHistoryGemini = async () => {
  const res = await axios.delete("/chat/history");
  return res;
};

// Lấy lịch sử backup/restore
export const getBackupHistory = async () => {
  const res = await axios.get("http://127.0.0.1:5000/admin/backup/history", { headers: authHeader() });
  return res;
};

// Lấy tổng quan backup
export const getBackupSummary = async () => {
  const res = await axios.get("http://127.0.0.1:5000/admin/backup/summary", { headers: authHeader() });
  return res;
};

// Tạo backup mới
export const createBackup = async () => {
  const res = await axios.post("http://127.0.0.1:5000/admin/backup", {}, { headers: authHeader() });
  return res;
};

// Tải file backup JSON
export const downloadBackupJson = async () => {
  const res = await axios.get("http://127.0.0.1:5000/admin/backup/json", { responseType: "blob", headers: authHeader() });
  return res;
};

// Tải file backup ZIP
export const downloadBackupZip = async () => {
  const res = await axios.get("http://127.0.0.1:5000/admin/backup/zip", { responseType: "blob", headers: authHeader() });
  return res;
};

// Tải file backup theo tên
export const downloadBackupFile = async (filename) => {
  const res = await axios.get(`http://127.0.0.1:5000/admin/backup/download/${filename}`, {
    responseType: "blob",
    headers: authHeader()
  });
  return res;
};

// Khôi phục từ file backup
export const restoreBackup = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post("http://127.0.0.1:5000/admin/restore", formData, {
    headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const deleteBackupFile = async (filename) => {
  const res = await axios.delete(`http://127.0.0.1:5000/admin/backup/delete/${filename}`, {
    headers: authHeader()
  });
  return res;
};  