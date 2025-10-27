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

# Show the list of recipe
def show_recipe():
        conn = get_db_connection()
        recipes = conn.execute("SELECT * FROM recipes").fetchall()
        conn.close()
        
        if recipes:
            recipe_dict = []

            for recipe in recipes:
                cooking_time = 0
                temp = recipe['cooking_time']
                cooking_time = (int(temp[0]) * 10 +  int(temp[1])) * 60 + (int(temp[3]) * 10 +  int(temp[4]))

                recipe_dict = recipe_dict +  [{
                            'id': recipe['recipe_id'],
                            'name': recipe['name'],
                            'image': recipe['image'][11:],
                            'cooking_time': cooking_time,
                            'rating': int(recipe['rating'])
                        }]
            
                
            
            return jsonify({
                'status': 'success',
                'data': recipe_dict
            }), 200
        else:
            return jsonify({
                'status': 'error'
            }), 404

# Search recipe by name 
def search_recipe_by_name():
        data = request.json 
        recipe_name = data.get('recipe_name')
        conn = get_db_connection()
        recipe = conn.execute("SELECT * FROM recipes WHERE name ?", (recipe_name,)).fetchone()
        conn.close()
        
        if recipe:
            recipe1 = [recipe]
            recipe_dict = []

            for recipe in recipe1:
                cooking_time = 0
                temp = recipe['cooking_time']
                cooking_time = (int(temp[0]) * 10 +  int(temp[1])) * 60 + (int(temp[3]) * 10 +  int(temp[4]))

                recipe_dict = recipe_dict +  [{
                            'id': recipe['recipe_id'],
                            'name': recipe['name'],
                            'image': recipe['image'][11:],
                            'cooking_time': cooking_time,
                            'rating': int(recipe['rating'])
                        }]
            return jsonify(recipe_dict), 200

        else:
            return jsonify({
                'status': 'error',
                'message': 'No recipe found'
            }), 404
    
#Get the detail of a recipe
def get_recipe_detail():
    data = request.json 
    recipe_id = data.get('recipe_id')
    
    conn = get_db_connection()
    recipe = conn.execute("""
    SELECT name, 
        image, 
        cooking_time, 
        rating, 
        ingredients, 
        steps, 
        carbs, 
        protein, 
        fat, 
        calories
    FROM recipes WHERE recipe_id = ?
    """, (recipe_id,)).fetchone()
    conn.close()
    
    if recipe:
        cooking_time = 0
        temp = recipe['cooking_time']
        cooking_time = (int(temp[0]) * 10 +  int(temp[1])) * 60 + (int(temp[3]) * 10 +  int(temp[4]))
        return jsonify({
            'status': 'success',
            "data":{
                'name': recipe['name'],
                'image': recipe['image'][11:],
                'cooking_time': cooking_time,
                'rating': recipe['rating'],
                'ingredients': json.loads(recipe['ingredients']),
                'steps': json.loads(recipe['steps']),
                'carbs': recipe['carbs'],
                'protein': recipe['protein'],
                'fat': recipe['fat'],
                'calories': recipe['calories']
            }
        }), 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({'status': 'error', 'message': 'Unavailable recipe'}), 404
    
#Add a recipe to the today menu 
def add_recipe_to_menu():
    data = request.json 
    user_id = data.get('user_id')
    recipe_id = data.get('recipe_id')
    meal = data.get('meal')
    
    conn = get_db_connection()
    recipe = conn.execute("SELECT recipe_id FROM recipes WHERE recipe_id = ?", (recipe_id,)).fetchone()
    conn.close()
    
    if recipe:
        conn = get_db_connection()
        conn.execute("""
        INSERT INTO eating_histories (user_id,recipe_id, day,meal,eaten)
        VALUES (?, ?, date('now'), ?,1)
        """, (user_id,recipe_id, meal))
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Recipe added to today menu'}), 200 
    
    else:
        return jsonify({'status': 'error', 'message': 'Unavailable recipe'}), 404

#Delete
def delete_recipe_from_menu():
    data = request.json 
    recipe_id = data.get('recipe_id')
    meal = data.get('meal')
    user_id = data.get('user_id')
    today_date = datetime.datetime.now().date()

    conn = get_db_connection()
    eating_history = conn.execute(
        "SELECT * FROM eating_histories WHERE recipe_id = ? AND day = ? AND meal = ? AND user_id = ?",
        (recipe_id, today_date, meal, user_id)
    ).fetchone()
    conn.close()
    
    if eating_history:
        conn = get_db_connection()
        conn.execute(
            "DELETE FROM eating_histories WHERE recipe_id = ? AND day = ? AND meal = ? AND user_id = ?",
            (recipe_id, today_date, meal, user_id)
        )
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Recipe deleted from today menu'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Unavailable history recorded'}), 404
        
    
    