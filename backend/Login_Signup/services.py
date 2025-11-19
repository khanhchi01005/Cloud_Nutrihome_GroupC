import requests
import datetime
import os
import pymysql
import json
from db_connector import get_db_connection
from dotenv import load_dotenv

load_dotenv()

class LoginError(Exception):
    pass

class RegisterError(Exception):
    pass

def login_user(username: str, password: str):
    """
    Kiểm tra đăng nhập user bằng username và password.
    Trả về dict user nếu thành công, None nếu không tồn tại.
    """
    connection = None
    try:
        connection = get_db_connection()
        if connection is None:
            raise LoginError("Không thể kết nối đến database.")

        cursor = connection.cursor(pymysql.cursors.DictCursor)
        connection.begin()

        # SELECT tất cả cột user
        query = """
            SELECT *
            FROM users
            WHERE username = %s AND password = %s
            LIMIT 1
        """
        cursor.execute(query, (username, password))
        user = cursor.fetchone()

        # Nếu có datetime, date, decimal… convert về string/float để JSON được
        if user:
            if user.get("dob") and isinstance(user["dob"], (datetime.date, datetime.datetime)):
                user["dob"] = user["dob"].strftime("%Y-%m-%d")

        connection.commit()
        return user

    except pymysql.MySQLError as err:
        if connection:
            connection.rollback()
        raise LoginError(f"Lỗi database: {err}")

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if connection:
            connection.close()

DEFAULT_AVATAR = "https://nutrihome-assets.s3.ap-southeast-1.amazonaws.com/images/users/macdinh.jpg"

def register_user(fullname, username, password, dob, height, weight, activity_level,
                  disease=None, allergen=None, gender=None):
    connection = None
    try:
        connection = get_db_connection()
        if connection is None:
            raise RegisterError("Không thể kết nối đến database.")

        cursor = connection.cursor(pymysql.cursors.DictCursor)
        connection.begin()

        # Kiểm tra username tồn tại
        cursor.execute("SELECT user_id FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            raise RegisterError("Username đã tồn tại.")

        # Tính BMI
        bmi = 0 if not height or not weight else round(weight / (height / 100) ** 2, 2)

        # ---- Chuẩn hóa bệnh & dị ứng ----
        disease = disease if disease else "no disease"
        allergen = allergen if allergen else "no allergen"

        # --- Gọi Gemini API để lấy target macros ---
        try:
            macros = get_target_macros(fullname, dob, height, weight, gender, activity_level, disease, allergen)
            target_carbs = macros.get("target_carbs", 0)
            target_protein = macros.get("target_protein", 0)
            target_fat = macros.get("target_fat", 0)
            calories = macros.get("target_calories", 0)
        except Exception:
            target_carbs = target_protein = target_fat = calories = 0

        # -------------------------------
        # TẠO FAMILY MỚI CHO USER
        # -------------------------------
        family_name = fullname
        family_description = f"Default family for {fullname}"

        cursor.execute(
            "INSERT INTO families (name, description) VALUES (%s, %s)",
            (family_name, family_description)
        )
        family_id = cursor.lastrowid

        # -------------------------------
        # THÊM USER MỚI
        # -------------------------------
        insert_query = """
            INSERT INTO users (
                fullname, username, password, dob, height, weight, bmi,
                activity_level, disease, allergen, gender,
                target_carbs, target_protein, target_fat, target_calories,
                eaten_carbs, eaten_protein, eaten_fat, eaten_calories,
                family_id, avatar
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # Convert tất cả giá trị số sang float và None → NULL
        params = (
            fullname,
            username,
            password,
            dob,
            float(height) if height is not None else None,
            float(weight) if weight is not None else None,
            float(bmi) if bmi is not None else None,
            activity_level,
            disease,
            allergen,
            gender,
            float(target_carbs) if target_carbs is not None else 0,
            float(target_protein) if target_protein is not None else 0,
            float(target_fat) if target_fat is not None else 0,
            float(calories) if calories is not None else 0,
            0,  # eaten_carbs
            0,  # eaten_protein
            0,  # eaten_fat
            0,  # eaten_calories
            family_id,
            DEFAULT_AVATAR
        )

        cursor.execute(insert_query, params)

        user_id = cursor.lastrowid

        # Commit toàn bộ transaction
        connection.commit()

        # Tính tuổi
        age = datetime.datetime.now().year - datetime.datetime.strptime(dob, "%Y-%m-%d").year

        return {
            "status": "success",
            "data": {
                "user": {
                    "user_id": user_id,
                    "fullname": fullname,
                    "family_id": family_id,
                    "age": age,
                    "target_carbs": target_carbs,
                    "target_protein": target_protein,
                    "target_fat": target_fat,
                    "target_calories": calories
                }
            }
        }

    except pymysql.MySQLError as e:
        if connection:
            connection.rollback()
        raise RegisterError(f"Lỗi database: {e}")

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if connection:
            connection.close()

def get_target_macros(fullname, dob, height, weight, gender, activity_level, disease=None, allergen=None):
    prompt = f"""
    Bạn là chuyên gia dinh dưỡng. 
    Dựa trên thông tin sau, hãy tính lượng dinh dưỡng hàng ngày phù hợp:
    - Họ và tên: {fullname}
    - Ngày sinh: {dob}
    - Giới tính: {gender}
    - Chiều cao: {height} cm
    - Cân nặng: {weight} kg
    - Mức độ vận động: {activity_level}
    - Bệnh lý: {disease or 'không'}
    - Dị ứng: {allergen or 'không'}

    Chỉ trả về JSON theo format sau:
    {{
        "target_carbs": number,
        "target_protein": number,
        "target_fat": number,
        "target_calories": number
    }}
    """

    url = f"{os.getenv('GEMINI_API_URL')}?key={os.getenv('GEMINI_API_KEY')}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()

        data = response.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]

        # --- Bước 1: loại bỏ ```json và ``` ---
        cleaned = raw_text.strip()
        cleaned = cleaned.replace("```json", "").replace("```", "").strip()

        # Nếu sau khi clean vẫn không load được thì dùng regex fallback
        try:
            return json.loads(cleaned)
        except:
            import re
            match = re.search(r"\{[\s\S]*\}", raw_text)
            if match:
                return json.loads(match.group(0))

        raise ValueError("Cannot parse JSON")

    except Exception as e:
        return {
            "target_carbs": 0,
            "target_protein": 0,
            "target_fat": 0,
            "target_calories": 0
        }