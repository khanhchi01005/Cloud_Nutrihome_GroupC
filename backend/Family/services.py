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
