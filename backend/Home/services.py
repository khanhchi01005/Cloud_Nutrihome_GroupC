# utils/user_nutrition.py
import pymysql
from db_connector import get_db_connection

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
