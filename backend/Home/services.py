from datetime import datetime
import sqlite3
import os
# Connect to the SQLite database
DATABASE = os.path.join(os.path.dirname(os.getcwd()), 'nutrihome.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

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

def fetch_calorie_chart(user_id):
    conn = get_db_connection()

    # Lấy chỉ tiêu dinh dưỡng của người dùng từ bảng users
    user = conn.execute("""
        SELECT target_calories, target_carbs, target_fat, target_protein 
        FROM users 
        WHERE user_id = ?
    """, (user_id,)).fetchone()
    if not user:
        conn.close()
        return {'status': 'error', 'message': 'User not found.'}, 404

    # Lấy dữ liệu hiện tại cho các chất dinh dưỡng
    nutrition_data = calculate_nutrition_for_user(user_id)
    
    # Trả về dữ liệu cho biểu đồ dinh dưỡng
    conn.close()
    return {
        'status': 'success',
        'data': {
            'chart': {
                'goalCalories': user['target_calories'],
                'goalCarbs': user['target_carbs'],
                'goalFat': user['target_fat'],
                'goalProtein': user['target_protein'],
                'absorbedCalories': nutrition_data['currentCalo'],
                'absorbedCarbs': nutrition_data['currentCarbs'],
                'absorbedFat': nutrition_data['currentFat'],
                'absorbedProtein': nutrition_data['currentProtein']
            }
        }
    }, 200