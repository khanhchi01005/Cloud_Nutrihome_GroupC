from flask import Flask, request, jsonify
import datetime
import json 
import logging
import os
from db import get_db_connection
import json
from flask import request, jsonify
from datetime import date, timedelta
from collections import defaultdict

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Using MySQL via `backend/db.py` get_db_connection()

#Show personal detail 
def show_personal_detail():
    data = request.json 
    user_id = data.get('user_id')
    conn = get_db_connection()
    person = conn.execute(
    '''SELECT fullname,
            user_id,
            username,
            gender,
            weight,
            height,
            dob,
            avatar,
            activity_level,
            disease,
            allergen   
    FROM users WHERE user_id = ?''',(user_id,)).fetchone ()
    conn.close()
    
    if person:
         return jsonify({
            'status': 'success',
            'data': {
                'user_id': person['user_id'],
                'avatar': person['avatar'],
                'fullname': person['fullname'],
                'username': person['username'],
                'gender': person['gender'],
                'dob': person['dob'],
                'height': person['height'],
                'weight': person['weight'],
                'activity_level': person['activity_level'],
                'disease': person['disease'],
                'allergen': person['allergen']
            }
        }), 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({'status': 'error', 'message': 'Unavailable user'}), 404

def update_personal_detail():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'status': 'fail', 'message': 'user_id is required'}), 400

    conn = get_db_connection()
    person = conn.execute(
        "SELECT user_id FROM users WHERE user_id = ?", (user_id,)
    ).fetchone()

    if not person:
        conn.close()
        return jsonify({'status': 'fail', 'message': 'User not found'}), 404

    # Lấy các field có dữ liệu để update
    fields_to_update = {}
    for field in ['height', 'weight', 'activity_level', 'disease', 'dob', 'allergen', 'fullname']:
        value = data.get(field)
        if value is not None:
            # Nếu disease hoặc allergen là list, convert sang JSON string
            if field in ['disease', 'allergen'] and isinstance(value, list):
                value = json.dumps(value)
            fields_to_update[field] = value

    if fields_to_update:
        # Tạo câu SQL động chỉ update những field có dữ liệu
        set_clause = ', '.join(f"{key} = ?" for key in fields_to_update)
        params = list(fields_to_update.values())
        params.append(user_id)  # cho WHERE user_id = ?

        conn.execute(f"UPDATE users SET {set_clause} WHERE user_id = ?", params)
        conn.commit()

    conn.close()
    return jsonify({'status': 'success', 'message': 'Updated personal detail successfully'}), 200

def show_history():
    user_id = request.args.get("user_id")  # lấy từ query param
    if not user_id:
        return jsonify({"status": "error", "message": "Missing user_id"}), 400

    today = date.today()
    last_5_days = [(today - timedelta(days=i)).isoformat() for i in range(5)]

    conn = get_db_connection()
    rows = conn.execute("""
        SELECT
            day,
            SUM(carbs) AS carbs,
            SUM(protein) AS protein,
            SUM(fat) AS fat,
            SUM(calories) AS calories
        FROM eating_histories
        JOIN recipes ON eating_histories.recipe_id = recipes.recipe_id
        WHERE user_id = ?
          AND day BETWEEN DATE_SUB(CURDATE(), INTERVAL 4 DAY) AND CURDATE()
        GROUP BY day
    """, (user_id,)).fetchall()
    conn.close()

    # Khởi tạo kết quả mặc định
    result = {day: {"carbs": 0, "protein": 0, "fat": 0, "calories": 0} for day in last_5_days}

    for row in rows:
        day = row["day"]
        if day in result:
            result[day]["carbs"] = row["carbs"] or 0
            result[day]["protein"] = row["protein"] or 0
            result[day]["fat"] = row["fat"] or 0
            result[day]["calories"] = row["calories"] or 0

    return jsonify({"status": "success", "data": result}), 200

def show_history_day_menu():
    user_id = request.args.get("user_id")
    day = request.args.get("day")  # dạng "YYYY-MM-DD"

    if not user_id or not day:
        return jsonify({"status": "error", "message": "Missing user_id or day"}), 400

    conn = get_db_connection()
    rows = conn.execute("""
        SELECT 
            eh.meal,
            r.recipe_id,
            r.name,
            r.image,
            r.calories,
            r.carbs,
            r.protein,
            r.fat,
            r.cooking_time,
            eh.eaten
        FROM eating_histories eh
        JOIN recipes r ON eh.recipe_id = r.recipe_id
        WHERE eh.user_id = ?
          AND eh.day = ?
          AND eh.eaten = 1
    """, (user_id, day)).fetchall()
    conn.close()

    result = {}

    # Khởi tạo các bữa ăn mặc định
    meals = ["breakfast", "lunch", "dinner"]
    for m in meals:
        result[m] = {"items": [], "nutrients": {"calories": 0, "carbs": 0, "protein": 0, "fat": 0}}

    # Gom dữ liệu
    for row in rows:
        meal_name = row["meal"]
        if meal_name not in result:
            result[meal_name] = {"items": [], "nutrients": {"calories": 0, "carbs": 0, "protein": 0, "fat": 0}}

        item = {
            "recipe_id": row["recipe_id"],
            "name": row["name"],
            "image": row["image"],
            "calories": row["calories"] or 0,
            "carbs": row["carbs"] or 0,
            "protein": row["protein"] or 0,
            "fat": row["fat"] or 0,
            "cooking_time": row["cooking_time"] or "00:30:00",
            "eaten": row["eaten"] or 0,
        }

        result[meal_name]["items"].append(item)
        result[meal_name]["nutrients"]["calories"] += item["calories"]
        result[meal_name]["nutrients"]["carbs"] += item["carbs"]
        result[meal_name]["nutrients"]["protein"] += item["protein"]
        result[meal_name]["nutrients"]["fat"] += item["fat"]

    return jsonify({"status": "success", "data": result}), 200
