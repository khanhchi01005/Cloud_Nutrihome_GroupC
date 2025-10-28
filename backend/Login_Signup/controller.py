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