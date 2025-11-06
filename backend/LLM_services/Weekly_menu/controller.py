from flask import Blueprint, request, jsonify
from .services import AI_generate_bonus_meal
user_bp = Blueprint("user_bp", __name__)

# API tạo thực đơn bổ sung cho user
@user_bp.route("/generate-bonus-meal", methods=["POST"])
def generate_bonus_meal():
    try:
        data = request.json
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"error": "Thiếu user_id"}), 400

        # Gọi hàm tạo thực đơn bổ sung cho user
        AI_generate_bonus_meal(user_id)
        return jsonify({"message": "Thực đơn bổ sung đã được tạo thành công"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
