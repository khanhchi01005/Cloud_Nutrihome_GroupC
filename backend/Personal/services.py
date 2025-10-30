from flask import Flask, request, jsonify
import sqlite3
import datetime
import json 
import logging
import os

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

DATABASE = os.path.join(os.path.dirname(os.getcwd()), 'nutrihome.db')
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

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
def update_personal_detail():
        data = request.json 
        user_id = data.get('user_id')
        height = data.get('height')
        weight = data.get('weight')
        activity_level = data.get('activity_level')
        dob = data.get('dob')
        disease = data.get('disease')
        allergen = data.get('allergen')
        fullname = data.get('fullname')
        conn = get_db_connection()
        person = conn.execute("SELECT user_id FROM eating_histories WHERE user_id = ?", (user_id,)).fetchone()
        conn.close()
        
        if person:
            conn = get_db_connection()
            conn.execute("""
            UPDATE users SET height = ?, weight = ?, activity_level = ?, disease = ?, dob = ?, allergen = ?, fullname = ?
            WHERE user_id = ?
            """, (height,weight,activity_level,user_id,disease,dob,allergen, fullname))
            conn.commit()
            conn.close()
            return jsonify({'status': 'success', 'message': 'Updated personal detail scuccessfully'}), 200 
        
        else:
            return jsonify({'status': 'error', 'message': 'Failed to update personal detail'}), 404

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
                AND day BETWEEN date('now', '-2 days') AND date('now')  -- Past 3 days, including today
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