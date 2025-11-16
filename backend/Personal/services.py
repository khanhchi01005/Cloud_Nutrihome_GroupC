from flask import Flask, request, jsonify
import datetime
import json 
import logging
import os
from db import get_db_connection

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

#Update personal detail
import json
from flask import request, jsonify

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


# Show nutrition history within 3 days
def show_history():
    data = request.json 
    user_id = data.get('user_id')
    conn = get_db_connection()

    user = conn.execute('SELECT user_id FROM eating_histories WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()

    if user:
        conn = get_db_connection()
        nutrition_data = conn.execute(
            '''
            SELECT
                day,
                meal,
                GROUP_CONCAT(recipes.name, ',') AS recipes,
                SUM(carbs) AS carbs,
                SUM(protein) AS protein,
                SUM(fat) AS fat,
                SUM(calories) AS calories
            FROM eating_histories 
            JOIN recipes 
            ON eating_histories.recipe_id = recipes.recipe_id
            WHERE user_id = ? 
                    AND day BETWEEN DATE_SUB(CURDATE(), INTERVAL 2 DAY) AND CURDATE()  -- Past 3 days, including today
            GROUP BY day, meal;
            ''', (user_id,)
        ).fetchall()
        conn.close()

        result = {}

        for row in nutrition_data:
            day = row['day']
            
            # Initialize the day if not already in result
            if day not in result:
                result[day] = {
                    "meals": {},
                    "carbs": 0,
                    "fat": 0,
                    "protein": 0,
                    "calories": 0
                }
            
            result[day]["meals"][row['meal']] = row['recipes'].split(',') if row['recipes'] else []
            result[day]["carbs"] += row['carbs'] or 0
            result[day]["fat"] += row['fat'] or 0
            result[day]["protein"] += row['protein'] or 0
            result[day]["calories"] += row['calories'] or 0

        # Directly return the result dictionary instead of a list
        return jsonify({'status': 'success', 'data': result}), 200, {'Content-Type': 'application/json'}

    return jsonify({'status': 'error', 'message': 'User not found'}), 404


#Show today's nutrition history 
def show_nutrition_today():
    data = request.json 
    user_id = data.get('user_id')
    conn = get_db_connection()
    
    user = conn.execute('SELECT user_id FROM eating_histories WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()
    
    if user:
        conn = get_db_connection()
        each_meal_data = conn.execute(
            '''
            SELECT 
                meal, 
                SUM(carbs) AS "carbs",
                SUM(protein) AS "protein",
                SUM(fat) AS "fat",
                SUM(calories) AS "calories"
            FROM eating_histories 
            JOIN recipes 
            ON eating_histories.recipe_id = recipes.recipe_id
                WHERE user_id = ? AND day = CURDATE() AND eaten = 1
            GROUP BY meal
            ''', (user_id,)
        ).fetchall()  
        
        total_meal_data = conn.execute(
            '''
            SELECT  
                SUM(carbs) AS "carbs",
                SUM(protein) AS "protein",
                SUM(fat) AS "fat",
                SUM(calories) AS "calories"
            FROM eating_histories 
            JOIN recipes 
            ON eating_histories.recipe_id = recipes.recipe_id
                WHERE user_id = ? AND day = CURDATE() AND eaten = 1
            GROUP BY day
            ''', (user_id,)
        ).fetchone()  
        
        conn.close()
        
        meals = {}
        for row in each_meal_data:
            meal = row['meal']
            meals[meal] = {
                "carbs": str(row['carbs'] or 0),
                "protein": str(row['protein'] or 0),
                "fat": str(row['fat'] or 0)
            }
        
        total_nutrients = {
            "carbs": str(total_meal_data['carbs'] or 0),
            "protein": str(total_meal_data['protein'] or 0),
            "fat": str(total_meal_data['fat'] or 0)
        }
        
        final_result = {
            "status": "success",
            "data": {
                "breakfast": meals.get("breakfast", {"carbs": "0", "protein": "0", "fat": "0"}),
                "lunch": meals.get("lunch", {"carbs": "0", "protein": "0", "fat": "0"}),
                "dinner": meals.get("dinner", {"carbs": "0", "protein": "0", "fat": "0"}),
                "total_nutrients": total_nutrients
            }
        }
        
        return jsonify(final_result), 200, {'Content-Type': 'application/json'}

    return jsonify({'status': 'error', 'message': 'User not found'}), 404