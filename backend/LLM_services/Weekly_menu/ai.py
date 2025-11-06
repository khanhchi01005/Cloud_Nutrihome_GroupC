import datetime
import requests
import sqlite3
import json
import re
import os
from dotenv import load_dotenv


def connect_db(db_name, timeout=30):
    print(f"[DB] 🔗 Kết nối database: {db_name}")
    return sqlite3.connect(db_name, timeout=timeout)

DATABASE = os.path.join(os.path.dirname(os.getcwd()), "nutrihome.db")


# ==========================
# 1️⃣ Lấy danh sách món ăn hiện có
# ==========================
def get_current_meal(conn, user_id, day=datetime.datetime.now().date()):
    print(f"\n[STEP 1] 🍽️ Lấy thực đơn hiện tại của user {user_id} (từ ngày {day})")
    conn = connect_db(DATABASE)
    cursor = conn.cursor()

    # Lấy family_id
    cursor.execute("SELECT family_id FROM users WHERE user_id = ?", (user_id,))
    result = cursor.fetchone()
    family_id = int(result[0]) if result and result[0] is not None else None
    print(f"   → family_id = {family_id}")

    # Lấy các recipe_id hiện có
    cursor.execute("""
        SELECT recipe_id
        FROM family_base
        WHERE family_id = ? AND day >= ?
    """, (family_id, day))
    recipes = cursor.fetchall()
    current_meal = [recipe[0] for recipe in recipes]
    print(f"   → Số món ăn hiện tại: {len(current_meal)} | IDs: {current_meal}")

    meal_details = []
    for recipe_id in current_meal:
        cursor.execute("""
            SELECT name, carbs, protein, fat, calories
            FROM recipes
            WHERE recipe_id = ?
        """, (recipe_id,))
        recipe = cursor.fetchone()
        if recipe:
            name, carbs, protein, fat, calories = recipe
            meal_details.append(
                f"Tên món {name} (ID {recipe_id}): {carbs}g carbs, {protein}g protein, {fat}g fat, {calories} kcal"
            )

    meal_details_str = "; ".join(meal_details) if meal_details else ""
    print(f"   → Thông tin chi tiết món ăn: {meal_details_str}")
    return meal_details_str


# ==========================
# 2️⃣ Lấy thông tin calo cá nhân
# ==========================
def get_user_calo(conn, user_id):
    print(f"\n[STEP 2] 🧍‍♂️ Lấy thông tin calo mục tiêu của user {user_id}")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT target_protein, target_fat, target_carbs, target_calories
        FROM users
        WHERE user_id = ?
    """, (user_id,))
    user_calo = cursor.fetchone()
    if user_calo:
        user_calo = {
            'target_protein': user_calo[0],
            'target_fat': user_calo[1],
            'target_carbs': user_calo[2],
            'target_calories': user_calo[3]
        }
        print(f"   → Dữ liệu calo: {user_calo}")
        return user_calo
    else:
        print(f"   ⚠️ Không tìm thấy thông tin cá nhân cho user {user_id}")
        return None


# ==========================
# 3️⃣ Lấy danh sách món ăn có sẵn
# ==========================
def get_available_meals(conn, user_id, day=datetime.datetime.now().date()):
    print(f"\n[STEP 3] 📋 Lấy các món ăn khả dụng cho user {user_id} (từ ngày {day})")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT recipe_id FROM eating_histories
        WHERE user_id = ? AND day >= ? AND eaten = 0
    """, (user_id, day))
    recipes = cursor.fetchall()
    available_meals = [recipe[0] for recipe in recipes]
    print(f"   → Có {len(available_meals)} món khả dụng | IDs: {available_meals}")
    return available_meals


# ==========================
# 4️⃣ Gọi Gemini để sinh thực đơn
# ==========================
def personal_menu(user_id, user_calo, available_meals, current_meal):
    print(f"\n[STEP 4] 🤖 Gọi Gemini API để sinh thực đơn mới cho user {user_id}")
    load_dotenv()
    API_KEY = os.getenv("GEMINI_API_KEY")
    API_URL = os.getenv("GEMINI_API_URL")

    headers = {'Content-Type': 'application/json'}

    target_protein = user_calo['target_protein']
    target_fat = user_calo['target_fat']
    target_carbs = user_calo['target_carbs']
    target_calories = user_calo['target_calories']

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": (
                            f"""Bạn là một chuyên gia dinh dưỡng chuyên xây dựng thực đơn.  
                            Hãy bổ sung thực đơn tuần (7 ngày) cho tôi từ những món ăn đã có sẵn: {current_meal}. 
                            Thực đơn sau khi bổ sung cần đáp ứng lượng chất cần thiết của cá nhân tôi lần lượt là 
                            {target_protein}g protein, {target_fat}g fat, {target_carbs}g carbs và {target_calories} calories. 
                            Sử dụng chỉ các món ăn có sẵn sau đây (với thông tin dinh dưỡng được cung cấp dưới dạng JSON, 
                            bao gồm lượng calo, protein, carbs, fat cho mỗi món): {available_meals}. 
                            Hạn chế tối đa sự lặp lại món ăn trong cùng một ngày và trong cả tuần, tính toán để phù hợp với sở thích ăn uống của độ tuổi của tôi.
                            Thực đơn cần cân đối đủ đạm, tinh bột, chất béo và chất xơ; không nên chỉ có một nhóm thực phẩm. 
                            Bữa sáng cần nhanh gọn, đủ chất dinh dưỡng với protein, chất xơ, và tinh bột, 
                            thường có một trong các món sau: bánh mì, phở, bún, cháo, xôi, bánh cuốn, mì, cơm.  
                            Bữa trưa cần đủ đạm, rau xanh, và tinh bột, tránh thức ăn quá dầu mỡ. 
                            Bữa tối nên nhẹ nhàng, ít tinh bột và dầu mỡ, tập trung vào rau xanh và đạm dễ tiêu. 
                            Trả về kết quả ở định dạng JSON, chứa thông tin chi tiết gồm cả các món ăn được bổ sung và các món ăn đã có, 
                            không giải thích hay có thông tin gì thêm. 
                            Không cần thêm \n hoặc \t vào kết quả trả về. 
                            Với eaten mặc định bằng 0, user_id là {user_id} lấy trong thông tin cá nhân của tôi. 
                            Kết quả trả về dưới dạng các object, ví dụ gồm: "user_id": 1, "recipe_id": 34, "day": '2024-11-09', "meal": "lunch", "eaten": 0.
                            """
                        )
                    }
                ]
            }
        ]
    }

    print(f"   → Gửi request tới {API_URL}")
    try:
        response = requests.post(API_URL, headers=headers, data=json.dumps(data), params={"key": API_KEY})
        print(f"   → Mã phản hồi: {response.status_code}")

        if response.status_code != 200:
            print("   ❌ Lỗi phản hồi từ API:")
            print(response.text)
            return None

        resp_json = response.json()
        print(f"   ✅ Phản hồi API (rút gọn): {json.dumps(resp_json)[:300]}...")

        try:
            clean_string = resp_json['candidates'][0]['content']['parts'][0]['text'][7:-3]
            data = json.loads(clean_string)
            print(f"   ✅ Parse thành công JSON gồm {len(data)} phần tử.")
            return data
        except Exception as e:
            print(f"   ⚠️ Lỗi khi parse dữ liệu JSON từ Gemini: {e}")
            return None

    except Exception as e:
        print(f"   ⚠️ Lỗi khi gọi Gemini API: {e}")
        return None


# ==========================
# 5️⃣ Tổng hợp toàn bộ luồng
# ==========================
def bonus_meal(user_id):
    print(f"\n[START] 🚀 Bắt đầu sinh thực đơn bổ sung cho user {user_id}")
    conn = connect_db(DATABASE)

    available_meals = get_available_meals(conn, user_id)
    current_meal = get_current_meal(conn, user_id)
    user_calo = get_user_calo(conn, user_id)

    if not user_calo:
        print("   ⚠️ Không thể sinh thực đơn do thiếu dữ liệu calo.")
        return

    bonus_meal_plan = personal_menu(user_id, user_calo, available_meals, current_meal)

    if not bonus_meal_plan:
        print("   ⚠️ Không nhận được thực đơn từ Gemini.")
        return

    cursor = conn.cursor()
    insert_query = """
    INSERT INTO eating_histories (user_id, recipe_id, day, meal, eaten) 
    VALUES (:user_id, :recipe_id, :day, :meal, :eaten)
    """
    try:
        cursor.executemany(insert_query, bonus_meal_plan)
        conn.commit()
        print(f"   ✅ Đã chèn {len(bonus_meal_plan)} bản ghi mới vào bảng eating_histories.")
    except sqlite3.Error as e:
        print("   ❌ Lỗi khi chèn dữ liệu:", e)


# ==========================
# 6️⃣ Xoá dữ liệu cũ
# ==========================
def delete_eating_histories():
    print(f"\n[CLEANUP] 🧹 Xóa dữ liệu bảng family_base")
    conn = connect_db(DATABASE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM family_base;")
    conn.commit()
    cursor.execute("DELETE FROM sqlite_sequence WHERE name = 'family_base';")
    conn.commit()
    cursor.execute("VACUUM;")
    conn.commit()
    cursor.close()
    conn.close()
    print("   ✅ Dọn dẹp xong.")


# ==========================
# 7️⃣ Chạy thử
# ==========================
if __name__ == "__main__":
    delete_eating_histories()
    # bonus_meal(4)
