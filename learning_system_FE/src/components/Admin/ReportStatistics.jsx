import React, { useEffect, useState } from "react";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { Bar, Pie, Line } from "react-chartjs-2";
import AdminUserService from "../../../services/AdminUserService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ReportStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    AdminUserService.getStatistics()
      .then(data => {
        setStats(data);
        console.log(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExportPDF = () => {
    alert("Xuất PDF (demo)");
  };

  const handleExportExcel = () => {
    alert("Xuất Excel (demo)");
  };

  if (loading) return <div className="p-6 text-center text-gray-400">Đang tải dữ liệu...</div>;
  if (!stats) return <div className="p-6 text-center text-red-500">Không có dữ liệu!</div>;

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold flex-1">Báo cáo & Thống kê lớp học</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-blue-600">{stats.totalSubmissions}</div>
          <div className="mt-2 text-gray-600">Số lượng bài nộp</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-green-600">{stats.averageScore}</div>
          <div className="mt-2 text-gray-600">Điểm trung bình</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-purple-600">{stats.completionRate}%</div>
          <div className="mt-2 text-gray-600">Tỉ lệ hoàn thành</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-2">Bài nộp theo tuần</h4>
          <Bar data={{
            labels: stats.barData.labels,
            datasets: [{
              label: "Bài nộp",
              data: stats.barData.data,
              backgroundColor: "#2563eb"
            }]
          }} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-2">Tỉ lệ hoàn thành</h4>
          <Pie data={{
            labels: stats.pieData.labels,
            datasets: [{
              data: stats.pieData.data,
              backgroundColor: ["#10b981", "#f59e42"],
              borderWidth: 1
            }]
          }} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} height={200} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-2">Điểm trung bình theo tuần</h4>
          <Line data={{
            labels: stats.lineData.labels,
            datasets: [{
              label: "Điểm trung bình",
              data: stats.lineData.data,
              fill: false,
              borderColor: "#a21caf",
              backgroundColor: "#a21caf",
              tension: 0.3
            }]
          }} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-8">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
          onClick={handleExportPDF}
        >
          <FileDown className="h-5 w-5" />
          Xuất PDF
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
          onClick={handleExportExcel}
        >
          <FileSpreadsheet className="h-5 w-5" />
          Xuất Excel
        </button>
      </div>
    </div>
  );
};

export default ReportStatistics; 