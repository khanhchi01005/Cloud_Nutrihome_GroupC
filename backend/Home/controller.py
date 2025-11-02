from flask import Blueprint, jsonify, request
from Home.services import fetch_calorie_chart

# Định nghĩa Blueprint cho các route liên quan đến calorie chart
calorie_bp = Blueprint('calorie', __name__)

@calorie_bp.route('/api/home/chart', methods=['GET'])
def get_calorie_chart():
    data = request.get_json()  # Lấy dữ liệu từ body của request
    user_id = data.get('user_id') if data else None  

    if not user_id:
        return jsonify({'status': 'error', 'message': 'user_id is required'}), 400

    # Gọi hàm xử lý từ service.py
    result, status_code = fetch_calorie_chart(user_id)
    return jsonify(result), status_code