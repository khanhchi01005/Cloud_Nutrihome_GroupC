from flask import Blueprint, jsonify, request
from Weekly_menu.services import get_weekly_menu_service, get_daily_nutrition_service, upload_receipt_service, check_eaten
# Định nghĩa Blueprint cho các route liên quan đến weekly menu
menu_bp = Blueprint('menu', __name__)

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

# Route cho API tải lên hóa đơn ăn ngoài
@menu_bp.route('/api/weekly_menu/upload', methods=['POST'])
def upload_receipt():
    data = request.get_json()

    result = upload_receipt_service(data["image_path"], data["user_id"], data["meal"])
    return jsonify(result)

@menu_bp.route("/api/menu/eaten", methods  =['POST'])
def eaten():
    return check_eaten()
