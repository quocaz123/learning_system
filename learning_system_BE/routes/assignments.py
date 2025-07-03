

from flask import Blueprint, jsonify, request
from utils.middleware import token_required, get_jwt_identity
from sqlalchemy import func
from services.assignment_service import (
    create_assignment as create_assignment_service,
    update_assignment as update_assignment_service,
    get_assignments as get_assignments_service,
    delete_assigment as delete_assignment_service,
)

assignment_bp = Blueprint('assignment', __name__)

@assignment_bp.route('/assignments', methods=['GET'])
@token_required(['teacher', 'admin'])
def get_assignments():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    try:
        result = get_assignments_service(page, per_page)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@assignment_bp.route('/assignments', methods=['POST'])
#@token_required(['teacher', 'admin'])
def create_assignment():
    try:
        data = request.get_json()
        assignment = create_assignment_service(data)
        return jsonify({"message": "Assignment created successfully", "assignment_id": assignment.assignment_id , "status" : 201}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@assignment_bp.route('/assignments/<int:assignment_id>', methods=['PUT'])
#@token_required(['teacher', 'admin'])
def update_assignment(assignment_id):
    data = request.get_json()
    try:
        assignment = update_assignment_service(assignment_id, data)
        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404
        return jsonify({"message": "Assignment updated successfully", "assignment_id": assignment.assignment_id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@assignment_bp.route('/assignments/<int:assignment_id>', methods=['DELETE'])
#@token_required(['teacher', 'admin'])
def delete_assignment(assignment_id):
    try:
        assignment = delete_assignment_service(assignment_id)
        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404
        return jsonify({"message": "Assignment deleted successfully", "assignment_id": assignment_id, "status" : 200}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500