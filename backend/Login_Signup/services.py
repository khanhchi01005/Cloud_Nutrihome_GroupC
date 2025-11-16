import datetime
import os
from db import get_db_connection

def login_user(username, password):
    conn = None
    try:
        conn = get_db_connection()
        user = conn.execute(
            "SELECT user_id, fullname, username, family_id FROM users WHERE username = ? AND password = ?",
            (username, password)
        ).fetchone()
        return user
    finally:
        if conn:
            conn.close()
            
            
def register_user(fullname, username, password, dob, height, weight, activity_level, disease, allergen, gender):
    conn = None
    try:
        conn = get_db_connection()

        # Kiểm tra người dùng đã tồn tại
        existing_user = conn.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        ).fetchone()

        if existing_user:
            return {'status': 'fail', 'message': 'Username already exists'}

        # Tính BMI nếu có height và weight
        bmi = 0 if height == 0 or weight == 0 else round(weight / (height / 100) ** 2, 2)

        # Đặt giá trị mặc định cho các trường không có dữ liệu
        target_carbs = 0
        target_protein = 0
        target_fat = 0
        target_calories = 0
        family_id = None

        # Thêm người dùng mới (dùng cursor để lấy lastrowid sau khi insert)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO users (
                fullname, username, password, dob, height, weight, bmi,
                activity_level, disease, allergen, gender,
                target_carbs, target_protein, target_fat, target_calories, family_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                fullname, username, password, dob, height, weight, bmi,
                activity_level, disease, allergen, gender,
                target_carbs, target_protein, target_fat, target_calories, family_id
            )
        )
        conn.commit()

        user_id = cursor.lastrowid

        # Tính tuổi người dùng
        age = datetime.datetime.now().year - datetime.datetime.strptime(dob, "%Y-%m-%d").year

        return {
            'status': 'success',
            'data': {
                'user': {
                    'user_id': user_id,
                    'fullname': fullname,
                    'age': age
                }
            }
        }
    except Exception as e:
        return {'status': 'fail', 'message': str(e)}
    finally:
        if conn:
            conn.close()