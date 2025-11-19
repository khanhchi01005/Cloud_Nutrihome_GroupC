from flask import jsonify
import json
from db import get_db_connection
import redis
import os
from dotenv import load_dotenv

load_dotenv()

# --- Redis AWS ---
REDIS_HOST = os.getenv("REDIS_HOST", "master.people-cache.cubpy1.apse1.cache.amazonaws.com")  # endpoint thật
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_TTL = int(os.getenv("REDIS_TTL", 300))

# Thêm socket_timeout=3 giây
rds_cache = redis.StrictRedis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
    ssl=True,            # encryption in transit
    socket_timeout=1     # timeout 1 giây
)

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
    cache_key = "recipes_cache"
    response_data = None

    # --- 1. Thử lấy từ Redis ---
    try:
        cached = rds_cache.get(cache_key)
        if cached:
            print("Recipes lấy từ Redis cache", flush=True)
            response_data = json.loads(cached)
    except Exception as e:
        print(f"Redis không connect hoặc timeout, tiếp tục query DB: {e}", flush=True)

    # --- 2. Nếu cache trống hoặc Redis fail, query DB ---
    if not response_data:
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
                'image': recipe['image'],
                'cooking_time': recipe['cooking_time'],
                'ingredients': ingredients_to_markdown(recipe['ingredients']),
                'steps': steps_to_markdown(recipe['steps']),
                'carbs': recipe['carbs'],
                'protein': recipe['protein'],
                'fat': recipe['fat'],
                'calories': recipe['calories']
            })

        response_data = {
            'status': 'success',
            'data': recipe_list
        }

        # --- 3. Lưu vào Redis, nếu connect được ---
        try:
            rds_cache.setex(cache_key, REDIS_TTL, json.dumps(response_data))
            print("Recipes lưu vào Redis cache", flush=True)
        except Exception as e:
            print(f"Không thể lưu vào Redis (Redis unreachable): {e}", flush=True)

    return jsonify(response_data), 200
