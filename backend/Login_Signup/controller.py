from flask import Blueprint, request, jsonify
from .services import login_user, register_user, LoginError, RegisterError

auth_bp = Blueprint('credentials', __name__, url_prefix='/api/credentials')

# API for logging in
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Dữ liệu JSON không hợp lệ"}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Thiếu username hoặc password"}), 400

    try:
        user = login_user(username, password)
        if user:
            # Trả về toàn bộ thông tin user
            return jsonify({
                "status": "success",
                "data": {
                    "user": user  # <-- trả nguyên dictionary user
                }
            }), 200
        else:
            return jsonify({"status": "error", "message": "Invalid username or password"}), 401

    except LoginError as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
# API for registering
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Dữ liệu JSON không hợp lệ"}), 400

    fullname = data.get('fullname')
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    dob = data.get('dob')
    height = data.get('height')
    weight = data.get('weight')
    activity_level = data.get('activity_level')
    disease = data.get('disease')
    allergen = data.get('allergen')
    gender = data.get('gender')

    if not all([fullname, username, password, confirm_password, dob, height, weight, activity_level, gender]):
        return jsonify({"status": "fail", "message": "Thiếu thông tin bắt buộc"}), 400

    if password != confirm_password:
        return jsonify({"status": "fail", "message": "Passwords do not match"}), 400

    try:
        result = register_user(fullname, username, password, dob, height, weight, activity_level, disease, allergen, gender)
        return jsonify(result), 201
    except RegisterError as e:
        return jsonify({"status": "fail", "message": str(e)}), 400