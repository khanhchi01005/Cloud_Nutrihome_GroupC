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
import boto3

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

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="ap-southeast-1"
)

S3_BUCKET = os.getenv("AWS_S3_BUCKET")

def update_personal_detail():
    # Dùng form thay vì JSON vì chứa file
    user_id = request.form.get('user_id')

    if not user_id:
        return jsonify({'status': 'fail', 'message': 'user_id is required'}), 400

    conn = get_db_connection()
    person = conn.execute(
        "SELECT user_id FROM users WHERE user_id = ?", (user_id,)
    ).fetchone()

    if not person:
        conn.close()
        return jsonify({'status': 'fail', 'message': 'User not found'}), 404

    # --- UPDATE THÔNG TIN VĂN BẢN (height, weight, ...)
    fields_to_update = {}
    for field in ['height', 'weight', 'activity_level', 'disease', 'dob', 'allergen', 'fullname']:
        value = request.form.get(field)
        if value is not None:
            if field in ['disease', 'allergen']:
                try:
                    value = json.dumps(json.loads(value))
                except:
                    pass
            fields_to_update[field] = value

    # --- Nếu có file avatar -> upload lên S3 private
    avatar_file = request.files.get("avatar")
    if avatar_file:
        s3_path = f"images/users/{user_id}.jpg"
        try:
            s3_path = f"images/users/{user_id}.jpg"
            s3.upload_fileobj(
                avatar_file,
                S3_BUCKET,
                s3_path,
                ExtraArgs={"ContentType": "image/jpeg"}  # public
            )

            # URL cố định
            avatar_url = f"https://{S3_BUCKET}.s3.amazonaws.com/{s3_path}"
            fields_to_update["avatar"] = avatar_url


        except Exception as e:
            conn.close()
            return jsonify({
                "status": "fail",
                "message": f"S3 upload error: {str(e)}"
            }), 500

    # --- UPDATE DATABASE
    if fields_to_update:
        set_clause = ', '.join(f"{key} = ?" for key in fields_to_update)
        params = list(fields_to_update.values())
        params.append(user_id)
        conn.execute(f"UPDATE users SET {set_clause} WHERE user_id = ?", params)
        conn.commit()

    conn.close()

    return jsonify({
        'status': 'success',
        'message': 'Updated personal detail successfully',
        'updated_fields': fields_to_update
    }), 200

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
          AND day BETWEEN DATE_SUB(CURDATE(), INTERVAL 4 DAY) AND CURDATE() AND eaten = 1
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
