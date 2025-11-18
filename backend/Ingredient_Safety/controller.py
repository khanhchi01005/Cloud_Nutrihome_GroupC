from flask import Blueprint,request,jsonify
from .services import scan_allergen

safety = Blueprint("safety", __name__, url_prefix="/api/ingredient_safety")

@safety.route('/scan_allergen', methods=['POST'])
def scan_allergen_route():
    return scan_allergen()