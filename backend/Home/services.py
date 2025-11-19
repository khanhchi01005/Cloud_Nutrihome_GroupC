# utils/user_nutrition.py
import pymysql
from db_connector import get_db_connection
from datetime import datetime

class UpdateError(Exception):
    pass

def get_user_nutrition(user_id: int):
    """Lấy 4 chỉ số eaten của user từ DB"""
    connection = None
    try:
        connection = get_db_connection()
        if connection is None:
            raise UpdateError("Cannot connect to database.")

        cursor = connection.cursor(pymysql.cursors.DictCursor)
        cursor.execute(
            "SELECT eaten_calories, eaten_carbs, eaten_fat, eaten_protein FROM users WHERE user_id=%s",
            (user_id,)
        )
        user_data = cursor.fetchone()
        return user_data

    except pymysql.MySQLError as e:
        raise UpdateError(f"Database error: {e}")

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if connection:
            connection.close()


def update_user_nutrition(user_id: int, calories: float, carbs: float, fat: float, protein: float):
    """Cập nhật 4 chỉ số eaten của user"""
    connection = None
    try:
        connection = get_db_connection()
        if connection is None:
            raise UpdateError("Cannot connect to database.")

        cursor = connection.cursor()
        connection.begin()

        update_query = """
            UPDATE users
            SET eaten_calories=%s, eaten_carbs=%s, eaten_fat=%s, eaten_protein=%s
            WHERE user_id=%s
        """
        cursor.execute(update_query, (calories, carbs, fat, protein, user_id))
        connection.commit()

    except pymysql.MySQLError as e:
        if connection:
            connection.rollback()
        raise UpdateError(f"Database error: {e}")

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if connection:
            connection.close()

def update_user_nutrition_daily(user_id: int):
    """Cập nhật 4 chỉ số eaten của user"""
    connection = None
    try:
        connection = get_db_connection()
        if connection is None:
            raise UpdateError("Cannot connect to database.")

        cursor = connection.cursor()
        connection.begin()

        update_query = """
            UPDATE users
            SET eaten_calories=0, eaten_carbs=0, eaten_fat=0, eaten_protein=0
            WHERE user_id=%s
        """
        cursor.execute(update_query, (user_id,))
        connection.commit()

    except pymysql.MySQLError as e:
        if connection:
            connection.rollback()
        raise UpdateError(f"Database error: {e}")

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if connection:
            connection.close()

def update_user_nutrition(user_id: int):
    """Tính tổng nutrient đã ăn trong ngày và cập nhật vào bảng users"""
    connection = None
    try:
        connection = get_db_connection()
        if connection is None:
            raise UpdateError("Cannot connect to database.")

        cursor = connection.cursor()
        connection.begin()

        # Lấy ngày hôm nay (YYYY-MM-DD)
        today = datetime.now().date()

        # Lấy danh sách recipe_id đã ăn hôm nay
        cursor.execute("""
            SELECT recipe_id 
            FROM eating_histories 
            WHERE user_id=%s AND day=%s AND eaten=1
        """, (user_id, today))

        recipe_ids = [row[0] for row in cursor.fetchall()]

        if not recipe_ids:
            # Không ăn gì → reset về 0 và return
            cursor.execute("""
                UPDATE users
                SET eaten_calories=0, eaten_carbs=0, eaten_fat=0, eaten_protein=0
                WHERE user_id=%s
            """, (user_id,))
            connection.commit()
            return

        # Tính tổng nutrient từ các recipe
        format_strings = ",".join(["%s"] * len(recipe_ids))
        cursor.execute(f"""
            SELECT 
                COALESCE(SUM(calories), 0),
                COALESCE(SUM(carbs), 0),
                COALESCE(SUM(fat), 0),
                COALESCE(SUM(protein), 0)
            FROM recipes
            WHERE recipe_id IN ({format_strings})
        """, recipe_ids)

        total_calories, total_carbs, total_fat, total_protein = cursor.fetchone()

        # Cập nhật ngược lại user
        cursor.execute("""
            UPDATE users
            SET eaten_calories=%s, eaten_carbs=%s, eaten_fat=%s, eaten_protein=%s
            WHERE user_id=%s
        """, (
            total_calories,
            total_carbs,
            total_fat,
            total_protein,
            user_id
        ))

        connection.commit()

    except pymysql.MySQLError as e:
        if connection:
            connection.rollback()
        raise UpdateError(f"Database error: {e}")

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if connection:
            connection.close()
