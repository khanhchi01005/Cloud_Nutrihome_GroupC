from flask import Blueprint,request,jsonify
from .services import upload_label

safety = Blueprint("safety", __name__)

@safety.route('/api/ingredient_safety', methods=['POST'])
def upload_ingredient_safety():
    data = request.get_json()

    result, status_code = upload_label(data)
    return jsonify(result), status_code