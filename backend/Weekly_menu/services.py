from datetime import datetime, timedelta
import os
from db_connector import get_db_connection
import easyocr 
import json
from dotenv import load_dotenv
import requests
from flask import request, jsonify
from collections import defaultdict
from zoneinfo import ZoneInfo
from pymysql.cursors import DictCursor

def get_start_of_week():
    # Lấy thời gian hiện tại ở GMT+7
    today = datetime.now(tz=ZoneInfo("Asia/Ho_Chi_Minh"))
    # Tính ngày Monday đầu tuần
    start_of_week = today - timedelta(days=today.weekday())

    return start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

class GetWeeklyMenuError(Exception):
    pass

def add_nutrients(target: dict, meal: dict):
    for key in ["calories", "carbs", "protein", "fat"]:
        target[key] = target.get(key, 0) + (meal.get(key) or 0)

def get_weekly_menu_service(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(DictCursor)

    start_of_week = get_start_of_week()
    end_of_week = start_of_week + timedelta(days=6)

    days_of_week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    weekly_menu = {
        day: {
            meal_type: {
                "items": [],
                "nutrients": {},
                "eaten": 0     # <--- thêm mặc định
            }
            for meal_type in ["breakfast", "lunch", "dinner"]
        }
        for day in days_of_week
    }

    cursor.execute("""
        SELECT r.recipe_id, r.name, r.image, eh.meal, eh.day, eh.eaten,
               r.carbs, r.protein, r.fat, r.calories, r.cooking_time
        FROM eating_histories eh
        JOIN recipes r ON eh.recipe_id = r.recipe_id  
        WHERE eh.user_id = %s AND eh.day BETWEEN %s AND %s
    """, (user_id, start_of_week.strftime('%Y-%m-%d'), end_of_week.strftime('%Y-%m-%d')))

    meals = cursor.fetchall()
    cursor.close()
    conn.close()

    for meal in meals:
        day_str = meal.get("day", "").strip()
        if not day_str:
            continue

        try:
            day_of_week = datetime.strptime(day_str, "%Y-%m-%d").strftime('%a').lower()
        except Exception:
            continue

        meal_type = meal.get("meal", "").strip().lower()
        if meal_type not in ["breakfast", "lunch", "dinner"]:
            continue

        # Món ăn
        meal_data = {
            "recipe_id": meal["recipe_id"],
            "name": meal["name"],
            "image": meal["image"] if meal["image"] else "",
            "calories": meal.get("calories") or 0,
            "carbs": meal.get("carbs") or 0,
            "protein": meal.get("protein") or 0,
            "fat": meal.get("fat") or 0,
            "cooking_time": str(meal.get("cooking_time") or "00:00:00"),
            "eaten": meal.get("eaten", 0)  # <--- LẤY TRẠNG THÁI ĐÃ ĂN CỦA MÓN
        }

        weekly_menu[day_of_week][meal_type]["items"].append(meal_data)

        # Cộng dinh dưỡng vào tổng
        add_nutrients(weekly_menu[day_of_week][meal_type]["nutrients"], meal)

    # -------------------------------
    # 🔥 TÍNH "eaten" CHO TỪNG BỮA
    # -------------------------------
    for day in days_of_week:
        for meal_type in ["breakfast", "lunch", "dinner"]:
            items = weekly_menu[day][meal_type]["items"]

            if len(items) == 0:
                weekly_menu[day][meal_type]["eaten"] = 0
            else:
                # Nếu *tất cả* items có eaten = 1 → eaten = 1
                all_eaten = all(item.get("eaten", 0) == 1 for item in items)
                weekly_menu[day][meal_type]["eaten"] = 1 if all_eaten else 0

    return {"status": "success", "data": {"menu": weekly_menu}}, 200

def add_custom_meal_service(data):
    user_id = data.get('user_id')
    name = data.get('name')
    day = data.get('day')
    meal = data.get('meal')

    if not user_id or not name or not day or not meal:
        return jsonify({
            'status': 'error',
            'message': 'Missing user_id, name, day, or meal'
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Tìm recipe_id từ bảng recipes
    cursor.execute("SELECT recipe_id FROM recipes WHERE name = %s", (name,))
    row = cursor.fetchone()
    recipe_id = row[0] if row else None  # <-- sửa ở đây

    # 2. Insert vào eating_histories
    cursor.execute("""
        INSERT INTO eating_histories (user_id, recipe_id, day, meal, eaten)
        VALUES (%s, %s, %s, %s, 0)
    """, (user_id, recipe_id, day, meal))

    conn.commit()
    conn.close()

    return jsonify({
        'status': 'success',
        'message': 'Custom meal added successfully'
    }), 200

def remove_custom_meal_service(data):
    user_id = data.get('user_id')
    name = data.get('name')
    day = data.get('day')
    meal = data.get('meal')

    if not user_id or not name or not day or not meal:
        return jsonify({'status': 'error', 'message': 'Missing user_id, name, day, or meal'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Tìm recipe_id từ bảng recipes
    cursor.execute("SELECT recipe_id FROM recipes WHERE name = %s", (name,))
    row = cursor.fetchone()
    recipe_id = row[0] if row else None

    # 2. Xóa trong eating_histories
    cursor.execute(
        """
        DELETE FROM eating_histories
        WHERE user_id = %s AND recipe_id = %s AND day = %s AND meal = %s
        """,
        (user_id, recipe_id, day, meal)
    )

    conn.commit()
    conn.close()

    return jsonify({'status': 'success', 'message': 'Custom meal removed successfully'}), 200

def upload_receipt_service(image_path, user_id, day, meal):
    reader = easyocr.Reader(['vi'])
    results = reader.readtext(image_path, detail=0)
    all_text = ' '.join(results)

    load_dotenv()
    API_KEY = os.getenv("GEMINI_API_KEY")
    API_URL = os.getenv("GEMINI_API_URL")

    payload = {
                "contents": [
            {
                "parts": [
                    {
                        "text": f"""You are given the receipt: {all_text}
                        Please list all the name of dishes. You just need to list, do not need to explain.
                        Example: 
                        ["Pho ga", "Pho", "Bun cha"]
                        """
                    }
                ]
            }
        ]
    }

    response = requests.post(API_URL, headers={"Content-Type": "application/json"},
                             data=json.dumps(payload), params={"key": API_KEY})
    
    if response.status_code != 200:
        return {"error": "Gemini API failed"}

    gemini_data = response.json()

    raw_text = gemini_data['candidates'][0]['content']['parts'][0]['text']

    # Remove markdown code block if the model returns ```json ... ```
    clean_text = raw_text.replace("```json", "").replace("```", "").strip()

    try:
        dish_names = json.loads(clean_text)
    except Exception as e:
        print("JSON parse failed:", clean_text)
        raise e

    conn = get_db_connection()
    cursor = conn.cursor()  # hoặc DictCursor nếu muốn

    list_of_food = []

    for dish in dish_names:
        cursor.execute(
            "SELECT recipe_id, name, image FROM recipes WHERE name LIKE %s", 
            (f"%{dish}%",)
        )
        recipe = cursor.fetchone()
        if recipe:
            recipe_id, name, image = recipe  # tuple cursor
            if not recipe_id:
                print(f"Recipe {name} has no recipe_id, skip")
                continue
            list_of_food.append({
                "recipe_id": recipe_id,
                "name": name,
                "image": image[11:] if image else None
            })
            cursor.execute(
                "INSERT INTO eating_histories (user_id, recipe_id, day, meal, eaten) VALUES (%s,%s,%s,%s,%s)",
                (user_id, recipe_id, day, meal, 0)
            )
        else:
            print(f"No recipe found for {dish}")

    conn.commit()
    conn.close()

    return {"listOfFood": list_of_food}

def check_eaten(data):
    user_id = data.get('user_id')
    meal = data.get('meal')
    day = data.get('day')
    if not user_id or not meal or not day:
        return jsonify({'status': 'error', 'message': 'Missing user_id, meal, or day'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Lấy tất cả recipe_id của bữa ăn
    cursor.execute(
        "SELECT recipe_id FROM eating_histories WHERE user_id=%s AND day=%s AND meal=%s",
        (user_id, day, meal)
    )
    records = cursor.fetchall()
    if not records:
        conn.close()
        return jsonify({'status': 'error', 'message': 'No record found'}), 404

    recipe_ids = [r[0] for r in records]

    # SUM dinh dưỡng từ nhiều recipe
    cursor.execute(
        f"SELECT SUM(carbs), SUM(protein), SUM(fat), SUM(calories) FROM recipes WHERE recipe_id IN ({','.join(['%s']*len(recipe_ids))})",
        recipe_ids
    )
    nutri = cursor.fetchone()
    if not nutri:
        conn.close()
        return jsonify({'status': 'error', 'message': 'Recipe nutrition not found'}), 404

    carbs, protein, fat, calories = nutri

    # Cộng vào user
    cursor.execute(
        "UPDATE users SET eaten_carbs=eaten_carbs+%s, eaten_protein=eaten_protein+%s, eaten_fat=eaten_fat+%s, eaten_calories=eaten_calories+%s WHERE user_id=%s",
        (carbs, protein, fat, calories, user_id)
    )

    # Cập nhật toàn bộ meal là eaten = 1
    cursor.execute(
        "UPDATE eating_histories SET eaten=1 WHERE user_id=%s AND day=%s AND meal=%s",
        (user_id, day, meal)
    )

    conn.commit()
    conn.close()
    return jsonify({'status': 'success', 'message': 'Updated eaten status & nutrition successfully'}), 200

def check_undo_eaten(data):
    user_id = data.get('user_id')
    meal = data.get('meal')
    day = data.get('day')
    if not user_id or not meal or not day:
        return jsonify({'status': 'error', 'message': 'Missing user_id, meal, or day'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Lấy danh sách recipe + trạng thái eaten
    cursor.execute(
        "SELECT recipe_id, eaten FROM eating_histories WHERE user_id=%s AND day=%s AND meal=%s",
        (user_id, day, meal)
    )
    records = cursor.fetchall()
    if not records:
        conn.close()
        return jsonify({'status': 'error', 'message': 'No record found'}), 404

    # Nếu ALL eaten = 0 thì không cho undo
    if all(r[1] == 0 for r in records):
        conn.close()
        return jsonify({'status': 'error', 'message': 'Meal is not marked as eaten'}), 400

    recipe_ids = [r[0] for r in records]

    cursor.execute(
        f"SELECT SUM(carbs), SUM(protein), SUM(fat), SUM(calories) FROM recipes WHERE recipe_id IN ({','.join(['%s']*len(recipe_ids))})",
        recipe_ids
    )
    nutri = cursor.fetchone()
    if not nutri:
        conn.close()
        return jsonify({'status': 'error', 'message': 'Recipe nutrition not found'}), 404

    carbs, protein, fat, calories = nutri

    # Trừ ra khỏi user
    cursor.execute(
        "UPDATE users SET eaten_carbs=eaten_carbs-%s, eaten_protein=eaten_protein-%s, eaten_fat=eaten_fat-%s, eaten_calories=eaten_calories-%s WHERE user_id=%s",
        (carbs, protein, fat, calories, user_id)
    )

    # Set toàn bộ meal thành chưa ăn
    cursor.execute(
        "UPDATE eating_histories SET eaten=0 WHERE user_id=%s AND day=%s AND meal=%s",
        (user_id, day, meal)
    )

    conn.commit()
    conn.close()

    return jsonify({'status': 'success', 'message': 'Undo eaten successfully'}), 200


