from flask import Blueprint
from .services import show_personal_detail
from .services import update_personal_detail
from .services import show_nutrition_today
from .services import show_history

personal = Blueprint("personal", __name__)

@personal.route("/api/personal", methods =['GET'])
def show_detail():
    return show_personal_detail()

@personal.route("/api/personal/update", methods = ['PATCH'])
def update_detail():
    return update_personal_detail()

@personal.route("/api/personal/history",methods =['GET'])
def show_nutrition_history():
    return show_history()

@personal.route("/api/personal/history/nutrients_detail",methods =['GET'])
def show_nutrition_detail_today():
    return show_nutrition_today()