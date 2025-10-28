import sqlite3
import datetime
import os

DATABASE = os.path.join(os.path.dirname(os.getcwd()), 'nutrihome.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def login_user(username, password):
    conn = None
    try:
        conn = get_db_connection()
        user = conn.execute(
            "SELECT user_id, fullname, username, family_id FROM users WHERE username = ? AND password = ?",
            (username, password)
        ).fetchone()
        return user
    finally:
        if conn:
            conn.close()