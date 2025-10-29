from flask import Blueprint, request, jsonify
from .services import login_user, register_user

auth_bp = Blueprint('credentials', __name__)

# API for logging in
@auth_bp.route('/api/credentials/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = login_user(username, password)

    if user:
        return jsonify({
            'status': 'success',
            'data': {
                'user': {
                    'user_id': user['user_id'],
                    'fullname': user['fullname'],
                    'username': user['username'],
                    'family_id': user['family_id']
                }
            }
        }), 200
    else:
        return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401
    
# API for registering
@auth_bp.route('/api/credentials/register', methods=['POST'])
def register():
    data = request.json
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

    if password != confirm_password:
        return jsonify({'status': 'fail', 'message': 'Passwords do not match'}), 400

    result = register_user(fullname, username, password, dob, height, weight, activity_level, disease, allergen, gender)

    if result['status'] == 'fail':
        return jsonify(result), 400

    return jsonify(result), 201