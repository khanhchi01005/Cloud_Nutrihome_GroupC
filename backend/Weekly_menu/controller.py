from flask import Blueprint, jsonify, request
from Weekly_menu.services import get_weekly_menu_service, get_daily_nutrition_service, upload_receipt_service, check_eaten, reset_weekly_menu_service
import os
import datetime
# Định nghĩa Blueprint cho các route liên quan đến weekly menu
menu_bp = Blueprint('menu', __name__)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "static", "uploads", "bills")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Route cho API lấy danh sách thực đơn hàng tuần
@menu_bp.route('/api/weekly_menu', methods=['GET'])
def get_weekly_menu():
    data = request.get_json()  # Lấy dữ liệu từ body của request
    user_id = data.get('user_id') if data else None  
    if not user_id:
        return jsonify({'status': 'error', 'message': 'user_id is required'}), 400

    result, status_code = get_weekly_menu_service(user_id)
    return jsonify(result), status_code

# Route cho API tính tổng calo và dinh dưỡng hàng ngày
@menu_bp.route('/api/weekly_menu/calories', methods=['GET'])
def get_daily_nutrition():
    data = request.get_json()  # Lấy dữ liệu từ body của request
    user_id = data.get('user_id') if data else None  
    if not user_id:
        return jsonify({'status': 'error', 'message': 'user_id is required'}), 400

    result, status_code = get_daily_nutrition_service(user_id)
    return jsonify(result), status_code

@menu_bp.route('/api/weekly_menu/upload', methods=['POST'])
def upload_receipt():
    user_id = request.form.get("user_id")
    meal = request.form.get("meal")
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Tạo thư mục user riêng
    user_dir = os.path.join(UPLOAD_FOLDER, str(user_id))
    os.makedirs(user_dir, exist_ok=True)

    # Lưu file
    filename = f"bill.jpg"
    file_path = os.path.join(user_dir, filename)
    file.save(file_path)

    # Gọi service xử lý OCR / trích xuất thực phẩm
    result = upload_receipt_service(file_path, user_id, meal)

    return jsonify(result), 200

@menu_bp.route("/api/menu/eaten", methods  =['POST'])
def eaten():
    return check_eaten()

@menu_bp.route('/api/weekly_menu/reset', methods=['POST'])
def reset_weekly_menu():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'status': 'error', 'message': 'user_id is required'}), 400

    result, status_code = reset_weekly_menu_service(user_id)
    return jsonify(result), status_code