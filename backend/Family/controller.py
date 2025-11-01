# controller.py
from flask import Blueprint, request, jsonify
from Family.services import (
    create_family_service,
    validate_member_service,
    add_all_members_service,
    get_family_health_list_service,
    get_family_missing_nutrient_service,
    get_shopping_list_service,
    get_family_detail1
)

family_bp = Blueprint('family', __name__)

# API Tạo gia đình
@family_bp.route('/family/health/create', methods=['POST'])
def create_family():
    data = request.get_json()
    family_name = data.get('family_name')
    user_id = data.get('user_id')
    image = data.get('image')
    description = data.get('description')
    result = create_family_service(family_name, user_id, image, description)
    return jsonify(result)
