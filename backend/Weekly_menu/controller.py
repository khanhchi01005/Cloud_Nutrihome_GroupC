import os
from flask import Blueprint, jsonify, request
from Weekly_menu.services import get_weekly_menu_service, upload_receipt_service, check_eaten, check_undo_eaten, add_custom_meal_service, remove_custom_meal_service

menu_bp = Blueprint('menu', __name__, url_prefix='/api/weekly_menu')

@menu_bp.route('/get_weekly_menu', methods=['GET'])
def get_weekly_menu():
    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return jsonify({'status': 'error', 'message': 'user_id is required'}), 400

    result, status_code = get_weekly_menu_service(user_id)
    return jsonify(result), status_code

@menu_bp.route("/add-custom-meal", methods=['POST'])
def add_custom_meal():
    return add_custom_meal_service(request.json)

@menu_bp.route("/remove-custom-meal", methods=['POST'])
def remove_custom_meal():
    return remove_custom_meal_service(request.json)

@menu_bp.route('/upload', methods=['POST'])
def upload_receipt():

    UPLOAD_FOLDER = "images/bills"

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
        
    # Lấy file
    file = request.files.get("file")
    user_id = request.form.get("user_id")
    day = request.form.get("day")
    meal = request.form.get("meal")

    if not file or not user_id or not day or not meal:
        return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

    try:
        # Lưu file vào server
        image_path = f"images/bills/{user_id}.jpg"
        file.save(image_path)

        # Gọi service OCR
        result = upload_receipt_service(
            image_path=image_path,
            user_id=int(user_id),
            day=day,
            meal=meal
        )

        return jsonify({'status': 'success', 'message': 'Upload thành công', 'data': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@menu_bp.route("/eaten", methods=['POST'])
def eaten():
    return check_eaten(data=request.json)

@menu_bp.route("/undo-eaten", methods=['POST'])
def undo_eaten():
    return check_undo_eaten(data=request.json)