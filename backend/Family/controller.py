# controller.py
from flask import Blueprint, request, jsonify
from Family.services import (
    get_family_members_service, 
    lookup_user_by_username_service, 
    add_user_to_family_service
)

family_bp = Blueprint('family', __name__, url_prefix='/api/family')

@family_bp.route('/get_family_members', methods=['GET'])
def get_family_members():
    family_id = request.args.get("family_id")
    return jsonify(get_family_members_service(family_id))


@family_bp.route('/lookup_user_by_username', methods=['GET'])
def lookup_user_by_username():
    username = request.args.get("username")
    return jsonify(lookup_user_by_username_service(username))


@family_bp.route('/add_user_to_family', methods=['POST'])
def add_user_to_family():
    data = request.get_json()
    family_id = data.get("family_id")
    user_id = data.get("user_id")
    return jsonify(add_user_to_family_service(family_id, user_id))
