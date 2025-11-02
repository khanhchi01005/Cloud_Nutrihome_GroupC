from flask import Flask
from flask import Flask
from flask_cors import CORS
from Recipes.controller  import recipes
from Personal.controller import personal
from Forum.controller import forum
from Ingredient_Safety.controller import safety
from Login_Signup.controller import auth_bp
from Home.controller import calorie_bp
from Weekly_menu.controller import menu_bp
from Family.controller import family_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(auth_bp)
    app.register_blueprint(calorie_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(family_bp)
    app.register_blueprint(recipes)
    app.register_blueprint(personal)
    app.register_blueprint(forum)
    app.register_blueprint(safety)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)