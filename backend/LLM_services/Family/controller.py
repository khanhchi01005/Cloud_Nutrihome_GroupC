from flask import Blueprint, request, jsonify
from .services import AI_generate_family_meal

familyMenu_bp = Blueprint("familyMenu_bp", __name__, url_prefix='/api/llm-services')

# API tạo thực đơn cho gia đình
@familyMenu_bp.route("/generate-family-meal", methods=["POST"])
def generate_family_meal():
    try:
        data = request.json
        family_id = data.get("family_id")

        # Thông số mới (OPTIONAL)
        start_date = data.get("start_date")          # yyyy-mm-dd
        end_date = data.get("end_date")              # yyyy-mm-dd
        available_ingredients = data.get("available_ingredients")  # string

        if not family_id:
            return jsonify({"error": "Thiếu family_id"}), 400

        # Gọi hàm AI kèm tham số mới
        AI_generate_family_meal(
            family_id=family_id,
            start_date=start_date,
            end_date=end_date,
            available_ingredients=available_ingredients
        )

        return jsonify({"message": "Thực đơn gia đình đã được tạo thành công"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
