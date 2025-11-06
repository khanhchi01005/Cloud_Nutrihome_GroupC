from flask import Flask, jsonify
from Family.controller import family_bp
from Weekly_menu.controller import user_bp
from dotenv import load_dotenv

# Tải biến môi trường
load_dotenv()

app = Flask(__name__)

# Đăng ký các Blueprint
app.register_blueprint(family_bp, url_prefix="/api/family")
app.register_blueprint(user_bp, url_prefix="/api/user")

# Kiểm tra trạng thái của backend
@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({"status": "Backend Flask đang hoạt động"}), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
