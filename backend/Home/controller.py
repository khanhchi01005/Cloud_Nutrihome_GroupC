from flask import Blueprint, jsonify, request
from Home.services import get_user_nutrition, update_user_nutrition, update_user_nutrition_daily, UpdateError, update_user_nutrition

# Blueprint cho các API nutrition/home
calorie_bp = Blueprint('calorie', __name__, url_prefix='/api/home')

@calorie_bp.route('/sync_nutrition', methods=['POST'])
def sync_nutrition():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "Missing JSON data"}), 400

    user_id = data.get("user_id")
    eaten = data.get("eaten", {})

    if user_id is None or not eaten:
        return jsonify({"status": "error", "message": "Missing user_id or eaten data"}), 400

    eaten_calories = eaten.get("calories", 0)
    eaten_carbs = eaten.get("carbs", 0)
    eaten_fat = eaten.get("fat", 0)
    eaten_protein = eaten.get("protein", 0)

    try:
        current = get_user_nutrition(user_id)
        if not current:
            return jsonify({"status": "error", "message": "User not found"}), 404

        # Kiểm tra sự khác biệt
        if (
            current["eaten_calories"] == eaten_calories and
            current["eaten_carbs"] == eaten_carbs and
            current["eaten_fat"] == eaten_fat and
            current["eaten_protein"] == eaten_protein
        ):
            return jsonify({"status": "success", "message": "No update needed"}), 200

        # Nếu khác thì trả luôn dữ liệu hiện tại từ DB
        return jsonify({"status": "success", "message": "Nutrition differs", "data": current}), 200

    except UpdateError as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@calorie_bp.route('/reset_eaten', methods=['POST'])
def reset_eaten():
    data = request.get_json()
    if not data or 'user_id' not in data:
        return jsonify({"status": "error", "message": "Missing user_id"}), 400

    user_id = data['user_id']

    try:
        update_user_nutrition_daily(user_id)
        return jsonify({"status": "success", "message": "Eaten values reset to 0"}), 200
    except UpdateError as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@calorie_bp.route('/update_calories', methods=['POST'])
def update_calories():
    data = request.get_json()
    if not data or 'user_id' not in data:
        return jsonify({"status": "error", "message": "Missing user_id"}), 400

    user_id = data['user_id']

    try:
        update_user_nutrition(user_id)
        return jsonify({"status": "success", "message": "Eaten values updated"}), 200
    except UpdateError as e:
        return jsonify({"status": "error", "message": str(e)}), 500
