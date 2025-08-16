from flask import Blueprint, request, send_file, jsonify, current_app
import os
import json
import io
import zipfile
from datetime import datetime
from models import User, Course, Assignment, BackupLog  # Thêm các model khác nếu cần
from database import db
from utils.middleware import token_required

backup_bp = Blueprint('backup', __name__)
BACKUP_DIR = os.path.join(os.path.dirname(__file__), '..', 'backup')
os.makedirs(BACKUP_DIR, exist_ok=True)

# Helper: serialize all data
def export_all_data():
    return {
        'users': [u.to_dict() for u in User.query.all()],
        'courses': [c.to_dict() for c in Course.query.all()],
        'assignments': [a.to_dict() for a in Assignment.query.all()],
        # Thêm các model khác nếu cần
    }

# GET /admin/backup/json
@backup_bp.route('/admin/backup/json', methods=['GET'])
@token_required('assistant')
def download_json():
    try:
        data = export_all_data()
        buf = io.BytesIO()
        buf.write(json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8'))
        buf.seek(0)
        filename = f'backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        # Ghi log
        log = BackupLog(event_type='backup', filename=filename, status='success', message='Backup JSON', created_at=datetime.utcnow())
        db.session.add(log)
        db.session.commit()
        return send_file(buf, as_attachment=True, download_name=filename, mimetype='application/json'), 200
    except Exception as e:
        return jsonify({'error': 'Backup thất bại', 'detail': str(e)}), 500

# GET /admin/backup/zip
@backup_bp.route('/admin/backup/zip', methods=['GET'])
@token_required('assistant')
def download_zip():
    try:
        data = export_all_data()
        json_bytes = json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8')
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
            zf.writestr('backup.json', json_bytes)
        buf.seek(0)
        filename = f'backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.zip'
        # Ghi log
        log = BackupLog(event_type='backup', filename=filename, status='success', message='Backup ZIP', created_at=datetime.utcnow())
        db.session.add(log)
        db.session.commit()
        return send_file(buf, as_attachment=True, download_name=filename, mimetype='application/zip'), 200
    except Exception as e:
        return jsonify({'error': 'Backup thất bại', 'detail': str(e)}), 500

# POST /admin/backup (tạo backup mới, lưu file vào backup/)
@backup_bp.route('/admin/backup', methods=['POST'])
@token_required('assistant')
def create_backup():
    try:
        now = datetime.now().strftime("%Y%m%d_%H%M%S")
        tables = [
            ('users', [u.to_dict() for u in User.query.all()]),
            ('courses', [c.to_dict() for c in Course.query.all()]),
            ('assignments', [a.to_dict() for a in Assignment.query.all()]),
        ]
        zip_path = os.path.join(BACKUP_DIR, f'backup_multi_{now}.zip')
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            for name, data in tables:
                json_bytes = json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8')
                zf.writestr(f'{name}_{now}.json', json_bytes)
        file_size = os.path.getsize(zip_path)  # Lấy kích thước file
        log = BackupLog(
            event_type='backup',
            filename=os.path.basename(zip_path),
            size=file_size,  # Lưu vào log
            status='success',
            message='Backup multi-table',
            created_at=datetime.utcnow()
        )
        db.session.add(log)
        db.session.commit()
        return jsonify({'status': 200, 'message': 'Backup thành công!', 'file': os.path.basename(zip_path)}), 200
    except Exception as e:
        return jsonify({'status': 'fail', 'error': str(e)}), 500

# POST /admin/restore (upload file backup, phục hồi dữ liệu)
@backup_bp.route('/admin/restore', methods=['POST'])
@token_required('assistant')
def restore_backup():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'Thiếu file backup'}), 400
    filename = file.filename
    try:
        data = json.load(file)
        db.session.query(User).delete()
        db.session.query(Course).delete()
        db.session.query(Assignment).delete()
        for u in data.get('users', []):
            db.session.add(User(**u))
        for c in data.get('courses', []):
            db.session.add(Course(**c))
        for a in data.get('assignments', []):
            db.session.add(Assignment(**a))
        db.session.commit()
        # Ghi log
        log = BackupLog(event_type='restore', filename=filename, status='success', message='Restore thành công', created_at=datetime.utcnow())
        db.session.add(log)
        db.session.commit()
        return jsonify({'message': 'Khôi phục dữ liệu thành công!'})
    except Exception as e:
        db.session.rollback()
        log = BackupLog(event_type='restore', filename=filename, status='fail', message=str(e), created_at=datetime.utcnow())
        db.session.add(log)
        db.session.commit()
        return jsonify({'error': 'Khôi phục thất bại', 'detail': str(e)}), 500

# GET /admin/backup/history (danh sách log backup/restore)
@backup_bp.route('/admin/backup/history', methods=['GET'])
@token_required('assistant')
def backup_history():
    logs = BackupLog.query.order_by(BackupLog.created_at.desc()).limit(100).all()
    result = [
        {
            'id': log.id,
            'event_type': log.event_type,
            'filename': log.filename,
            'status': log.status,
            'message': log.message,
            'created_at': log.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'size': log.size # Thêm kích thước vào kết quả
        }
        for log in logs
    ]
    return jsonify({'history': result})

# GET /admin/backup/summary (tổng quan backup)
@backup_bp.route('/admin/backup/summary', methods=['GET'])
@token_required('assistant')
def backup_summary():
    files = [os.path.join(BACKUP_DIR, f) for f in os.listdir(BACKUP_DIR) if os.path.isfile(os.path.join(BACKUP_DIR, f))]
    total = len(files)
    total_size = sum(os.path.getsize(f) for f in files)
    latest = max(files, key=os.path.getctime) if files else None
    latest_time = datetime.fromtimestamp(os.path.getctime(latest)).strftime('%Y-%m-%d %H:%M:%S') if latest else None
    return jsonify({
        'total': total,
        'latest_time': latest_time,
        'total_size': total_size
    })

# GET /admin/backup/download/<filename>
@backup_bp.route('/admin/backup/download/<filename>', methods=['GET'])
@token_required('assistant')
def download_backup_file(filename):
    fpath = os.path.join(BACKUP_DIR, filename)
    if not os.path.isfile(fpath):
        return jsonify({'error': 'File không tồn tại'}), 404
    return send_file(fpath, as_attachment=True, download_name=filename), 200 

# DELETE /admin/backup/delete/<filename>
@backup_bp.route('/admin/backup/delete/<filename>', methods=['DELETE'])
@token_required('assistant')
def delete_backup_file(filename):
    fpath = os.path.join(BACKUP_DIR, filename)
    if not os.path.isfile(fpath):
        return jsonify({'status': 'fail', 'error': 'File không tồn tại'}), 404
    try:
        os.remove(fpath)
        # Xóa log nếu muốn
        BackupLog.query.filter_by(filename=filename).delete()
        db.session.commit()
        return jsonify({'status': 200, 'message': 'Đã xóa file backup!'}), 200
    except Exception as e:
        return jsonify({'status': 'fail', 'error': str(e)}), 500 