from flask import jsonify
import json
from db import get_db_connection

def ingredients_to_markdown(ingredients_json):
    if not ingredients_json:
        return ""

    try:
        items = json.loads(ingredients_json)
    except:
        return ""

    lines = ["### Nguyên liệu", ""]
    for item in items:
        name = item.get("name", "")
        qty = item.get("quantity", "")
        unit = item.get("unit", "")

        if qty and unit:
            lines.append(f"- **{name}** — {qty} {unit}")
        else:
            lines.append(f"- **{name}**")

    return "\n".join(lines)


def steps_to_markdown(steps_json):
    if not steps_json:
        return ""

    try:
        steps = json.loads(steps_json)
    except:
        return ""

    lines = ["### Các bước thực hiện", ""]
    for i, step in enumerate(steps, start=1):
        lines.append(f"{i}. {step}")

    return "\n".join(lines)


def show_recipe():
    conn = get_db_connection()
    recipes = conn.execute("""
        SELECT 
            recipe_id,
            name,
            image,
            cooking_time,
            ingredients,
            steps,
            carbs,
            protein,
            fat,
            calories
        FROM recipes
    """).fetchall()
    conn.close()

    if not recipes:
        return jsonify({'status': 'error', 'message': 'No recipes found'}), 404

    recipe_list = []

    for recipe in recipes:

        recipe_list.append({
            'id': recipe['recipe_id'],
            'name': recipe['name'],
            'image': recipe['image'][11:],  
            'cooking_time': recipe['cooking_time'],
            'ingredients': ingredients_to_markdown(recipe['ingredients']),
            'steps': steps_to_markdown(recipe['steps']),
            'carbs': recipe['carbs'],
            'protein': recipe['protein'],
            'fat': recipe['fat'],
            'calories': recipe['calories']
        })

    return jsonify({
        'status': 'success',
        'data': recipe_list
    }), 200
