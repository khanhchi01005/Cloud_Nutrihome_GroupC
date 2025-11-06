from flask import Blueprint, request, jsonify
from .services import AI_generate_family_meal, Delete_family_weekly_menu

familyMenu_bp = Blueprint("familyMenu_bp", __name__)

# API tạo thực đơn cho gia đình
@familyMenu_bp.route("/generate-family-meal", methods=["POST"])
def generate_family_meal():
    try:
        data = request.json
        family_id = data.get("family_id")

        if not family_id:
            return jsonify({"error": "Thiếu family_id"}), 400

        # Gọi hàm tạo thực đơn gia đình
        AI_generate_family_meal(family_id)
        return jsonify({"message": "Thực đơn gia đình đã được tạo thành công"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API xoá toàn bộ thực đơn tuần của gia đình
@familyMenu_bp.route("/reset-family-meal", methods=["POST"])
def reset_family_meal():
    try:
        data = request.json
        family_id = data.get("family_id")

        if not family_id:
            return jsonify({"error": "Thiếu family_id"}), 400
        
        msg = Delete_family_weekly_menu(family_id)

        return jsonify({"message": msg}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500