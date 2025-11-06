from flask import Blueprint,request,jsonify
from .services import upload_label
import os
from datetime import datetime

safety = Blueprint("safety", __name__)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "static", "uploads", "ingredient_safety")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@safety.route('/api/ingredient_safety', methods=['POST'])
def upload_ingredient_safety():
    user_id = request.form.get("user_id")
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Tạo thư mục người dùng riêng
    user_dir = os.path.join(UPLOAD_FOLDER, str(user_id))
    os.makedirs(user_dir, exist_ok=True)

    # Lưu file
    filename = f"ingredients.jpg"
    file_path = os.path.join(user_dir, filename)
    file.save(file_path)

    # Gọi service xử lý an toàn nguyên liệu
    result, status_code = upload_label(file_path, user_id)

    return jsonify(result), status_code
