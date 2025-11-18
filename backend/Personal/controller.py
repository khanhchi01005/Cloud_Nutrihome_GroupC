from flask import Blueprint
from .services import show_personal_detail
from .services import update_personal_detail
from .services import show_history_day_menu
from .services import show_history

personal = Blueprint("personal", __name__, url_prefix='/api/personal')

@personal.route("/get_detail", methods =['GET'])
def show_detail():
    return show_personal_detail()

@personal.route("/update", methods = ['PATCH'])
def update_detail():
    return update_personal_detail()

@personal.route("/history",methods =['GET'])
def show_nutrition_history():
    return show_history()

@personal.route("/history_menu",methods =['GET'])
def show_history_menu():
    return show_history_day_menu()