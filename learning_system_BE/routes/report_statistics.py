from flask import Blueprint, jsonify
from models.assignment import Submission
from sqlalchemy import func, extract
from database import db
import datetime
from utils.middleware import token_required

report_statistics_bp = Blueprint('report_statistics', __name__)

@report_statistics_bp.route('/admin/report-statistics', methods=['GET'])
@token_required('assistant')
def get_report_statistics():
    # Mock dữ liệu tuần (có thể thay bằng truy vấn động)
    weeks = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"]
    submissions_per_week = [30, 25, 35, 30]
    avg_score_per_week = [7.2, 7.5, 8.0, 7.8]
    total_submissions = sum(submissions_per_week)
    average_score = round(sum(avg_score_per_week) / len(avg_score_per_week), 2)
    completion_rate = 85  # Giả lập, có thể tính dựa trên số học viên hoàn thành

    data = {
        "totalSubmissions": total_submissions,
        "averageScore": average_score,
        "completionRate": completion_rate,
        "barData": {
            "labels": weeks,
            "data": submissions_per_week
        },
        "pieData": {
            "labels": ["Hoàn thành", "Chưa hoàn thành"],
            "data": [completion_rate, 100 - completion_rate]
        },
        "lineData": {
            "labels": weeks,
            "data": avg_score_per_week
        }
    }
    return jsonify(data), 200 