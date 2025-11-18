from db import get_db_connection
from dotenv import load_dotenv
from datetime import datetime, timedelta
import requests
import json
import os

# --- Lấy thông tin thành viên gia đình dưới dạng string ---
def get_members_info(conn, family_id):
    cursor = conn.cursor()
    query = """
        SELECT 
            user_id, gender, dob, weight, height, 
            activity_level, target_protein, target_fat, target_carbs, target_calories,
            disease, allergen
        FROM users
        WHERE family_id = %s
    """
    cursor.execute(query, (family_id,))
    users_info = cursor.fetchall()
    
    user_info_strings = []
    for user in users_info:
        user_id = user['user_id']
        gender = user['gender']
        dob = user['dob']
        weight = user['weight']
        height = user['height']
        activity_level = user['activity_level']
        target_protein = user['target_protein']
        target_fat = user['target_fat']
        target_carbs = user['target_carbs']
        target_calories = user['target_calories']
        disease = user.get('disease')
        allergen = user.get('allergen')

        user_info_string = (
            f"Người dùng có user_id {user_id} là {gender} sinh ngày {dob}, "
            f"cao {height}cm, nặng {weight}kg, với mức năng động {activity_level}, "
            f"có lượng dưỡng chất cần thiết mỗi ngày là {target_protein}g protein, {target_fat}g fat, "
            f"{target_carbs}g carbs, {target_calories} calories"
        )
        if disease:
            user_info_string += f", bệnh: {disease}"
        if allergen:
            user_info_string += f", dị ứng: {allergen}"

        user_info_strings.append(user_info_string)
    
    return '; '.join(user_info_strings)

# --- AI tạo thực đơn chung cho gia đình ---
def AI_family_meal(family_info, available_meals, start_date=None, end_date=None, available_ingredients=None):
    load_dotenv()
    API_KEY = os.getenv("GEMINI_API_KEY")
    API_URL = os.getenv("GEMINI_API_URL")

    headers = {'Content-Type': 'application/json'}
    today = datetime.now().date()
    available_meals_str = json.dumps(available_meals, ensure_ascii=False)

    data = { "contents": [ { "parts": [ { "text": f"""Bạn là một chuyên gia dinh dưỡng. Hãy xây dựng thực đơn cho gia đình bắt đầu từ ngày {start_date or today} đến ngày {end_date or (today + timedelta(days=6))} với thông tin cá nhân từng thành viên: {family_info}. Tuy nhiên, không cần phải đạt đủ lượng dưỡng chất cho từng thành viên, mà chỉ cần thỏa mãn yêu cầu về dinh dưỡng tối thiểu và tất cả thành viên cùng ăn được. Cần căn chỉnh dựa theo nguyên liệu gia đình đang có: {available_ingredients or "không có nguyên liệu cụ thể"}. Mỗi ngày gồm 3 bữa (sáng, trưa, tối) đáp ứng nhu cầu dinh dưỡng hàng ngày sau: Sử dụng chỉ các món ăn có sẵn sau đây (với thông tin dinh dưỡng được cung cấp dưới dạng JSON, bao gồm lượng calo, protein, carbs, fat cho mỗi món): {available_meals_str}. Yêu cầu bổ sung: Mỗi trưa và bữa tối có 3-5 món, bữa sáng: 1-2 món. Hạn chế tối đa sự lặp lại món ăn trong cùng một ngày và trong cả tuần. Thực đơn cần cân đối đủ đạm, tinh bột, chất béo và chất xơ; không nên chỉ có một nhóm thực phẩm để đảm bảo dinh dưỡng và năng lượng. Bữa sáng cần nhanh gọn, đủ chất dinh dưỡng với protein, chất xơ, và tinh bột để duy trì năng lượng, bữa sáng thường có một trong các món sau: bánh mì, phở, bún, cháo, xôi, bánh cuốn, mì, cơm. Bữa trưa cần đủ đạm, rau xanh, và tinh bột, tránh thức ăn quá dầu mỡ. Bữa tối nên nhẹ nhàng, ít tinh bột và dầu mỡ, tập trung vào rau xanh và đạm dễ tiêu. Lưu ý tránh các món có thành viên gia đình dị ứng hoặc bệnh. Trả về kết quả ở định dạng JSON. Không cần thêm \n hoặc \t vào kết quả trả về. Kết quả trả về dưới dạng các object gồm: "recipe_id": 34, "day": {today}, "meal": "lunch", """ } ] } ] }

    response = requests.post(API_URL, headers=headers, data=json.dumps(data), params={"key": API_KEY})
    
    if response.status_code == 200:
        resp_json = response.json()
        clean_string = resp_json['candidates'][0]['content']['parts'][0]['text'][7:-3]
        try:
            return json.loads(clean_string)
        except Exception as e:
            print("Không thể parse JSON từ AI:", e)
            return None
    else:
        print("Lỗi khi gọi API Gemini:", response.status_code)
        return None

# --- Lấy tất cả các công thức ---
def get_all_recipes(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT recipe_id, name, protein, fat, carbs, calories FROM recipes")
    recipes = cursor.fetchall()
    
    formatted = []
    for r in recipes:
        formatted.append(f"ID: {r['recipe_id']}, Name: {r['name']}, Protein: {r['protein']}g, Fat: {r['fat']}g, Carbs: {r['carbs']}g, Calories: {r['calories']}")
    return "\n".join(formatted)

# --- Lấy chi tiết recipe từ general_meal ---
def get_recipe_details(general_meal, conn):
    cursor = conn.cursor()
    recipe_ids = [meal['recipe_id'] for meal in general_meal]
    if not recipe_ids:
        return json.dumps([])
    placeholders = ','.join(['%s'] * len(recipe_ids))
    query = f"SELECT name, ingredients FROM recipes WHERE recipe_id IN ({placeholders})"
    cursor.execute(query, recipe_ids)
    results = cursor.fetchall()

    recipe_list = []
    for r in results:
        recipe_list.append({
            "name": r['name'],
            "ingredients": json.loads(r['ingredients'])
        })
    return json.dumps(recipe_list, ensure_ascii=False)

# --- Insert các món ăn vào eating_histories cho từng thành viên ---
def insert_family_meal_to_db(family_id, general_meal, conn):
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM users WHERE family_id = %s", (family_id,))
    users = [row['user_id'] for row in cursor.fetchall()]

    insert_query = "INSERT INTO eating_histories (user_id, recipe_id, day, meal, eaten) VALUES (%s, %s, %s, %s, %s)"

    try:
        for user_id in users:
            for meal in general_meal:
                cursor.execute(insert_query, (
                    user_id,
                    meal['recipe_id'],
                    meal['day'],
                    meal['meal'],
                    0
                ))
        conn.commit()
    except Exception as e:
        print("Lỗi khi thêm dữ liệu vào eating_histories:", e)
        conn.rollback()

# --- Hàm chính ---
def get_simple_family_meal(family_id, start_date=None, end_date=None, available_ingredients=None):
    conn = get_db_connection()
    family_info = get_members_info(conn, family_id)
    available_meals = get_all_recipes(conn)
    general_meal = AI_family_meal(family_info, available_meals, start_date=start_date, end_date=end_date, available_ingredients=available_ingredients)
    insert_family_meal_to_db(family_id, general_meal, conn)
    conn.close()
