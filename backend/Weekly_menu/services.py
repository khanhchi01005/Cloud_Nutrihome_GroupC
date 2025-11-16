from datetime import datetime, timedelta
import os
from db import get_db_connection
import easyocr 
import json
from dotenv import load_dotenv
import requests
from flask import request, jsonify
# Connect to the SQLite database
# Using MySQL via `backend/db.py` get_db_connection()


def get_start_of_week():
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday())
    return start_of_week

def get_weekly_menu_service_2(user_id):
    conn = get_db_connection()

    # Ngày bắt đầu của tuần (Monday)
    start_of_week = get_start_of_week()
    end_of_week = start_of_week + timedelta(days=6)

    # Chuẩn structure
    days_of_week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

    weekly_menu = {
        day: {
            "breakfast": {"items": [], "nutrients": {}},
            "lunch": {"items": [], "nutrients": {}},
            "dinner": {"items": [], "nutrients": {}},
        }
        for day in days_of_week
    }

    # Lấy tất cả meals trong tuần
    meals = conn.execute("""
        SELECT r.recipe_id, r.name, r.image, eh.meal, eh.day,
               r.carbs, r.protein, r.fat, r.calories
        FROM eating_histories eh
        JOIN recipes r ON eh.recipe_id = r.recipe_id  
        WHERE eh.user_id = ? AND eh.day BETWEEN ? AND ?
    """, (
        user_id, 
        start_of_week.strftime('%Y-%m-%d'),
        end_of_week.strftime('%Y-%m-%d')
    )).fetchall()

    # Hàm cộng dồn dinh dưỡng
    def add_nutrients(target, meal):
        target["calories"] = target.get("calories", 0) + (meal["calories"] or 0)
        target["carbs"] = target.get("carbs", 0) + (meal["carbs"] or 0)
        target["protein"] = target.get("protein", 0) + (meal["protein"] or 0)
        target["fat"] = target.get("fat", 0) + (meal["fat"] or 0)

    # Nhét dữ liệu vào weekly menu
    for meal in meals:
        try:
            meal_date = datetime.strptime(meal["day"].strip(), "%Y-%m-%d")
        except:
            continue

        day_of_week = meal_date.strftime('%a').lower()  # mon, tue...

        meal_type = meal["meal"]  # breakfast / lunch / dinner

        meal_data = {
            "recipe_id": meal["recipe_id"],
            "name": meal["name"],
            "image": meal["image"][11:]
        }

        # Append item
        weekly_menu[day_of_week][meal_type]["items"].append(meal_data)

        # Add nutrient sum
        add_nutrients(weekly_menu[day_of_week][meal_type]["nutrients"], meal)

    conn.close()

    return {
        "status": "success",
        "data": {
            "menu": weekly_menu
        }
    }, 200

def get_daily_nutrition_service(user_id):
    conn = get_db_connection()
    nutrition = conn.execute("""
        SELECT SUM(carbs) as carbs, SUM(protein) as protein, SUM(fat) as fat, SUM(calories) as calories
        FROM eating_histories
        JOIN recipes ON eating_histories.recipe_id = recipes.recipe_id
        WHERE user_id = ? AND DATE(day) = CURDATE()
    """, (user_id,)).fetchone()
    conn.close()

    if nutrition:
        return {
            'status': 'success',
            'data': {
                'calories': nutrition['calories'],
                'carbs': nutrition['carbs'],
                'protein': nutrition['protein'],
                'fat': nutrition['fat']
            }
        }, 200
    else:
        return {'status': 'error', 'message': 'Unable to load nutritional information.'}, 404

def upload_receipt_service(file, user_id, meal):
    reader = easyocr.Reader(['vi'])

    image_path = file
    results = reader.readtext(image_path, detail=0)

    all_text = ' '.join(results)

    load_dotenv()
    API_KEY = os.getenv("GEMINI_API_KEY")
    API_URL = os.getenv("GEMINI_API_URL")

    headers = {'Content-Type': 'application/json'}

    data = {
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

    response = requests.post(API_URL, headers=headers, data=json.dumps(data), params={"key": API_KEY})

    if response.status_code != 200:
        print(f"Lỗi khi gọi API Gemini: {response.status_code}")
        return

    response_data = response.json()
    dish_names = json.loads(response_data['candidates'][0]['content']['parts'][0]['text'])

    conn = get_db_connection()
    cursor = conn.cursor()
    list_of_food = []

    for dish in dish_names:
        cursor.execute("SELECT recipe_id, name, image FROM recipes WHERE name LIKE ?", (f"%{dish}%",))
        recipe = cursor.fetchone()

        if recipe:
            recipe_id, name, image = recipe

            list_of_food.append({
                "recipe_id": recipe_id,
                "name": name,
                "image": image[11:]
            })

            today = datetime.now().date()
            cursor.execute(
                """
                INSERT INTO eating_histories (user_id, recipe_id, day, meal, eaten)
                VALUES (?, ?, ?, ?, ?)
                """,
                (user_id, recipe_id, today, meal, 1)
            )

    conn.commit()
    conn.close()

    return {"listOfFood": list_of_food}

def check_eaten():
        data = request.json
        user_id = data.get('user_id')
        meal = data.get('meal')
    
        conn = get_db_connection()
        person = conn.execute("SELECT * FROM eating_histories WHERE user_id = ?", (user_id,)).fetchone()
        conn.close()
        
        today = datetime.now().date()

        if person:
            conn = get_db_connection()
            conn.execute("""
            UPDATE eating_histories SET eaten = 1
            WHERE user_id = ? AND day = ? AND meal =?
            """, (user_id, today, meal))
            conn.commit()
            conn.close()
            return jsonify({'status': 'success', 'message': 'Updated personal detail scuccessfully'}), 200 

        
        else:
            return jsonify({'status': 'error', 'message': 'Failed to update personal detail'}), 404
