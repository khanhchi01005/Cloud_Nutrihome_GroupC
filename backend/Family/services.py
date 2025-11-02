from datetime import datetime
import sqlite3
import json
import os
from flask import jsonify

# Connect to the SQLite database
DATABASE = os.path.join(os.path.dirname(os.getcwd()), 'nutrihome.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def create_family_service(family_name, user_id, image, description):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT COUNT(*) FROM families WHERE family_id = ?", (user_id,))
        if cursor.fetchone()[0] > 0:
            return {
                'message': 'Family with this user_id already exists.',
                'status': 'error'
            }

        cursor.execute("""
            INSERT INTO families (family_id, name, image, target_carbs, target_protein, target_fat, target_calories, description) 
            VALUES (?, ?, ?, 0, 0, 0, 0, ?)
        """, (user_id, family_name, image, description))
        
        # Cập nhật family_id cho người dùng
        cursor.execute("""
            UPDATE users SET family_id = ? WHERE user_id = ?
        """, (user_id, user_id))
        
        conn.commit()

        return {
            'family_id': user_id,
            'message': 'Family created successfully'
        }
        
    except Exception as e:
        print(f"Error: {e}")
        return {
            'message': 'An error occurred while creating family.',
            'error': str(e)
        }
    finally:
        conn.close()

def validate_member_service(invitee_username):
    conn = get_db_connection()
    invitee = conn.execute("""
        SELECT username, fullname AS name, avatar AS profile_image 
        FROM users WHERE username = ?
    """, (invitee_username,)).fetchone()
    conn.close()

    if invitee:
        return {
            'status': 'success',
            'waiting_list': {
                'username': invitee['username'],
                'name': invitee['name'],
                'profile_image': invitee['profile_image']
            }
        }
    else:
        return {
            'status': 'error',
            'message': 'User not found'
        }

def add_all_members_service(family_id, usernames):
    conn = get_db_connection()
    cursor = conn.cursor()
    for username in usernames:
        cursor.execute("""
            UPDATE users SET family_id = ? WHERE username = ?
        """, (family_id, username))
    conn.commit()
    conn.close()

    return {
        'status': 'success',
        'message': 'All users successfully added to the family',
        'added_members': usernames
    }

def get_family_health_list_service(family_id):
    if not family_id:
        return {"status": "error", "message": "family_id is required"}
    
    conn = get_db_connection()
    family_members = conn.execute("""
        SELECT 
            fullname AS name, 
            username, 
            avatar AS profile_image, 
            user_id AS user_id, 
            target_carbs as targetCarbs, 
            target_fat as targetFat, 
            target_protein as targetProtein, 
            target_calories as targetCalo
        FROM users 
        WHERE family_id = ?
    """, (family_id,)).fetchall()
    conn.close()

    if not family_members:
        return {"status": "error", "message": "No family members found"}

    members_list = []
    totalCurrentCarbs = 0
    totalCurrentFat = 0
    totalCurrentProtein = 0
    for member in family_members:
        nutrition_data = calculate_nutrition_for_user(member["user_id"])

         # Tính tổng giá trị dinh dưỡng hiện tại của cả nhà
        totalCurrentCarbs += nutrition_data["currentCarbs"]
        totalCurrentFat += nutrition_data["currentFat"]
        totalCurrentProtein += nutrition_data["currentProtein"]
        
        members_list.append({
            "name": member["name"],
            "username": member["username"],
            "profile_image": member["profile_image"],
            "user_id": member["user_id"],
            "currentCarbs": nutrition_data["currentCarbs"],
            "targetCarbs": member["targetCarbs"],
            "currentFat": nutrition_data["currentFat"],
            "targetFat": member["targetFat"],
            "currentProtein": nutrition_data["currentProtein"],
            "targetProtein": member["targetProtein"],
            "currentCalo": nutrition_data["currentCalo"],
            "targetCalo": member["targetCalo"]
        })

    return {
        "status": "success",
        "family_members": members_list,
        # Thêm các giá trị tổng dinh dưỡng hiện tại của cả gia đình để sử dụng cho phần biểu đồ missing
        "totalCurrentCarbs": totalCurrentCarbs,
        "totalCurrentFat": totalCurrentFat,
        "totalCurrentProtein": totalCurrentProtein
    }

# Hàm tính các chỉ số dinh dưỡng hiện tại cho mỗi thành viên trong ngày hiện tại
def calculate_nutrition_for_user(user_id):
    conn = get_db_connection()
    today = datetime.now().strftime('%Y-%m-%d')  # Lấy ngày hiện tại dưới dạng chuỗi 'YYYY-MM-DD'

    # Truy vấn lịch sử ăn uống của thành viên trong ngày hiện tại
    eating_history = conn.execute("""
        SELECT recipe_id
        FROM eating_histories 
        WHERE user_id = ? AND day = ? AND eaten = 1
    """, (user_id, today)).fetchall()

    # Khởi tạo các chỉ số dinh dưỡng hiện tại
    currentCarbs = 0
    currentFat = 0
    currentProtein = 0
    currentCalo = 0

    # Tính toán tổng các chỉ số dinh dưỡng dựa trên `eating_history` của ngày hiện tại
    for entry in eating_history:
        recipe = conn.execute("""
            SELECT carbs, fat, protein, calories 
            FROM recipes 
            WHERE recipe_id = ?
        """, (entry['recipe_id'],)).fetchone()
        
        if recipe:
            
            currentCarbs += recipe['carbs'] 
            currentFat += recipe['fat'] 
            currentProtein += recipe['protein'] 
            currentCalo += recipe['calories'] 

    conn.close()
    
    return {
        "currentCarbs": currentCarbs,
        "currentFat": currentFat,
        "currentProtein": currentProtein,
        "currentCalo": currentCalo
    }


def get_family_missing_nutrient_service(family_id):
    # Lấy dữ liệu dinh dưỡng hiện tại của cả gia đình
    family_data = get_family_health_list_service(family_id)
    
    if family_data["status"] != "success":
        return {"status": "error", "message": "Unable to retrieve family data"}

    # Tổng hợp target của cả gia đình
    conn = get_db_connection()
    family_targets = conn.execute("""
        SELECT 
            SUM(target_carbs) AS totalTargetCarbs,
            SUM(target_fat) AS totalTargetFat,
            SUM(target_protein) AS totalTargetProtein
        FROM users
        WHERE family_id = ?
    """, (family_id,)).fetchone()
    conn.close()

    # Tính toán missing dinh dưỡng
    totalCurrentCarbs = family_data["totalCurrentCarbs"]
    totalCurrentFat = family_data["totalCurrentFat"]
    totalCurrentProtein = family_data["totalCurrentProtein"]

    missingCarbs = family_targets["totalTargetCarbs"] - totalCurrentCarbs
    missingFat = family_targets["totalTargetFat"] - totalCurrentFat
    missingProtein = family_targets["totalTargetProtein"] - totalCurrentProtein

    return {
        "status": "success",
        "missing_nutrition": {
            "missingCarbs": missingCarbs,
            "currentCarbs": totalCurrentCarbs,
            "missingFat": missingFat,
            "currentFat": totalCurrentFat,
            "missingProtein": missingProtein,
            "currentProtein": totalCurrentProtein
        }
    }

def get_shopping_list_service(family_id):
    conn = get_db_connection()

    # Truy vấn danh sách mua sắm dựa trên `family_id` và `day`
    result = conn.execute("""
        SELECT suggested_ingredients
        FROM suggested_ingredients
        WHERE family_id = ?
    """, (family_id,)).fetchall()
    
    conn.close()  
    
    if result:
        # Chuyển đổi suggested_ingredients từ chuỗi JSON thành đối tượng Python
        suggested_ingredients_list = []
        for row in result:
            # Giả sử row['suggested_ingredients'] là một chuỗi JSON
            suggested_ingredients = json.loads(row['suggested_ingredients'])
            suggested_ingredients_list.extend(suggested_ingredients['suggested_ingredients'])
        
        return {
            "family_id": family_id,
            "suggested_ingredients": suggested_ingredients_list
        }
    else:
        return {"status": "error", "message": "No suggested ingredients found"}
    
def get_family_detail1(family_id):
    if not family_id:
        return {"status": "error", "message": "family_id is required"}
    
    conn = get_db_connection()
    family_detail = conn.execute("""
        SELECT 
            name, 
            description   
        FROM families
        WHERE family_id = ?
    """, (family_id,)).fetchall()
    conn.close()

    if family_detail:
        family_list = {
            "name": family_detail[0]["name"],  # Truy cập tuple đầu tiên
            "description": family_detail[0]["description"]
        }
    else:
        family_list = []  # Nếu không có kết quả nào

    return {
        "status": "success" if family_list else "error",
        "family_detail": family_list
    }