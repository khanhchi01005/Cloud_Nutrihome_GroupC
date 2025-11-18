import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from Recipes.controller  import recipes
from Personal.controller import personal
from Forum.controller import forum
from Ingredient_Safety.controller import safety
from Login_Signup.controller import auth_bp
from Home.controller import calorie_bp
from Weekly_menu.controller import menu_bp
from Family.controller import family_bp
from LLM_services.Weekly_menu.controller import user_bp
from LLM_services.Family.controller import familyMenu_bp 
from db_connector import test_connection

load_dotenv()

def create_app():
    app = Flask(__name__)

    FRONTEND_URL = os.getenv("FRONTEND_URL")
    
    CORS(app, origins=FRONTEND_URL)

    # Đăng ký các blueprint
    app.register_blueprint(auth_bp)
    app.register_blueprint(calorie_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(family_bp)
    app.register_blueprint(recipes)
    app.register_blueprint(personal)
    app.register_blueprint(forum)
    app.register_blueprint(safety)
    app.register_blueprint(user_bp)
    app.register_blueprint(familyMenu_bp)

    # ✅ Route test connection
    @app.route("/ping", methods=["GET"])
    def ping():
        return jsonify({"message": "✅ Backend is running!", "status": "ok"}), 200

    return app


if __name__ == "__main__":
    app = create_app()
    test_connection()
    app.run(debug=True)
