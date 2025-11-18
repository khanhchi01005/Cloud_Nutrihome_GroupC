from flask import Blueprint
from .services import show_recipe

recipes = Blueprint("recipes", __name__,url_prefix='/api/recipes')

@recipes.route("/get-all", methods =['GET'])
def show_recipes():
    return show_recipe()