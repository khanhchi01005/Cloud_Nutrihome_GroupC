from flask import Flask, request, jsonify
import datetime
import json 
import logging
import easyocr
import os
import json
from dotenv import load_dotenv
import requests
from db import get_db_connection

def scan_allergen():
    """
    API nhận file hình ảnh nhãn sản phẩm, kiểm tra nguyên liệu gây dị ứng
    Request form-data: file, user_id
    """
    UPLOAD_FOLDER = "images/ingredient_safety"
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    # Lấy file và user_id
    file = request.files.get("file")
    user_id = request.form.get("user_id")

    if not file or not user_id:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    try:
        # Lưu file tạm
        image_path = os.path.join(UPLOAD_FOLDER, f"{user_id}.jpg")
        file.save(image_path)

        # Lấy allergen của user
        conn = get_db_connection()
        row = conn.execute("SELECT allergen FROM users WHERE user_id = ?", (user_id,)).fetchone()
        conn.close()

        if not row or not row.get("allergen"):
            return jsonify({"status": "error", "message": "User allergen not found"}), 404

        allergen = row["allergen"]

        # OCR với EasyOCR
        reader = easyocr.Reader(["vi"])
        results = reader.readtext(image_path, detail=0)
        all_text = " ".join(results)

        # Gọi API Gemini
        load_dotenv()
        API_KEY = os.getenv("GEMINI_API_KEY")
        API_URL = os.getenv("GEMINI_API_URL")

        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"""
        Từ nhãn sản phẩm này: {all_text}

        Người dùng bị dị ứng các chất: {allergen}

        Chỉ liệt kê **các nguyên liệu xuất hiện trong nhãn (OCR) mà nằm trong danh sách dị ứng của người dùng**, bằng tiếng Việt, **mỗi nguyên liệu trên 1 dòng**, không thêm gì ngoài những nguyên liệu đã đọc được. 
        Nếu không có nguyên liệu nào từ OCR trùng với dị ứng, trả về rỗng.
        Ví dụ:
        Sữa,
        Đậu nành
        """
                        }
                    ]
                }
            ]
        }

        response = requests.post(API_URL, headers=headers, data=json.dumps(data), params={"key": API_KEY})

        response_data = response.json()

        result_text = ""
        candidates = response_data.get("candidates", [])
        if candidates:
            content = candidates[0].get("content", {})
            parts = content.get("parts", [])
            if parts:
                result_text = parts[0].get("text", "")

        return jsonify({"status": "success", "allergen_found": result_text})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
