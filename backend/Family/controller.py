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

# API Xác thực thành viên trước khi thêm vào gia đình
@family_bp.route('/family/health/add-member/validate', methods=['POST'])
def validate_member():
    data = request.get_json()
    invitee_username = data.get('invitee_username')
    
    result = validate_member_service(invitee_username)
    return jsonify(result)

# API Thêm tất cả thành viên từ danh sách chờ vào gia đình
@family_bp.route('/family/health/add-member/add-all', methods=['POST'])
def add_all_members():
    data = request.get_json()
    family_id = data.get('family_id')
    usernames = data.get('usernames')
    
    result = add_all_members_service(family_id, usernames)
    return jsonify(result)

# API Lấy danh sách thành viên trong gia đình và dữ liệu cho biểu đồ dinh dưỡng từng thành viên
@family_bp.route('/family/health/list', methods=['GET'])
def get_family_health_list():
    data = request.get_json()  
    family_id = data.get('family_id')  
    
    result = get_family_health_list_service(family_id)
    return jsonify(result)

# API lấy thông tin family
@family_bp.route('/family/detail', methods=['GET'])
def get_family_detail():
    data = request.get_json()  
    family_id = data.get('family_id')  
    
    result = get_family_detail1(family_id)
    return jsonify(result)

# API Lấy dữ liệu thiếu hụt chất dinh dưỡng của gia đình
@family_bp.route('/family/health/missing_nutrient', methods=['GET'])
def get_family_missing_nutrient():
    data = request.get_json()
    family_id = data.get('family_id')
    
    if not family_id:
        return jsonify({"status": "error", "message": "family_id is required"}), 400

    result = get_family_missing_nutrient_service(family_id)
    return jsonify(result)

# API Đề xuất danh sách mua sắm cho gia đình
@family_bp.route('/family/shopping-list', methods=['GET'])
def get_shopping_list():
    data = request.get_json()
    family_id = data.get('family_id')

    if not family_id:
        return jsonify({'status': 'error', 'message': 'family_id and day are required'}), 400

    result = get_shopping_list_service(family_id)
    return jsonify(result)