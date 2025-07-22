from flask import Blueprint, send_from_directory, request, jsonify, current_app
import os
from werkzeug.utils import secure_filename

fileupload_bp = Blueprint('fileupload', __name__)

UPLOAD_FOLDER_NAME = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'docx', 'pdf', 'ppt', 'pptx', 'zip', 'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@fileupload_bp.route('/uploads/<path:filename>')
def uploaded_file(filename):
    uploads_dir = os.path.abspath(os.path.join(current_app.root_path, '..', UPLOAD_FOLDER_NAME))
    return send_from_directory(uploads_dir, filename, as_attachment=True)

@fileupload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        
        uploads_dir = os.path.abspath(os.path.join(current_app.root_path, '..', UPLOAD_FOLDER_NAME))
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
            
        save_path = os.path.join(uploads_dir, filename)
        file.save(save_path)
        file_url = f'/uploads/{filename}'
        return jsonify({'file_url': file_url}), 200
    return jsonify({'error': 'File type not allowed'}), 400