import React, { useState, useEffect } from "react";
import AdminUserService from "../../../services/AdminUserService";
import { Trash } from "lucide-react";

const UserManagement = () => {
  const [tab, setTab] = useState("student");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    AdminUserService.getAllUsers()
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => u.role === tab);

  const openDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await AdminUserService.deleteUser(selectedUser.id);
      setShowDelete(false);
      fetchUsers();
    } catch (error) {
      alert("Có lỗi khi xóa!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              tab === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("student")}
          >
            Sinh viên
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              tab === "teacher"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("teacher")}
          >
            Giảng viên
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Đang tải dữ liệu...</div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">STT</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Họ tên</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vai trò</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium">{user.fullName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">
                    {user.role === "student" ? "Sinh viên" : "Giảng viên"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {user.status === "active" ? "Hoạt động" : "Ngưng"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => openDelete(user)}
                      title="Xóa"
                    >
                      <Trash className="inline h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        )}
      </div>

      {/* Modal Xóa */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-red-600">Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <span className="font-semibold">{selectedUser?.fullName}</span>?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
                onClick={() => setShowDelete(false)}
                disabled={saving}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Đang xóa..." : <Trash className="inline h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 