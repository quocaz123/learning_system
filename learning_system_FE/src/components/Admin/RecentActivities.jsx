import React, { useEffect, useState } from "react";
import AdminUserService from "../../../services/AdminUserService";
import { Code, Users, GraduationCap, BookOpen } from "lucide-react";

const activityIcon = {
  submission: <Code className="h-4 w-4 text-blue-600" />,
  login: <Users className="h-4 w-4 text-green-600" />,
  completion: <GraduationCap className="h-4 w-4 text-purple-600" />,
  course: <BookOpen className="h-4 w-4 text-orange-600" />,
  other: <Users className="h-4 w-4 text-gray-400" />,
};

const activityBg = {
  submission: "bg-blue-100",
  login: "bg-green-100",
  completion: "bg-purple-100",
  course: "bg-orange-100",
  other: "bg-gray-100",
};

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminUserService.getRecentActivities()
      .then((data) => setActivities(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải hoạt động...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${activityBg[activity.type]}`}>
                {activityIcon[activity.type]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities; 