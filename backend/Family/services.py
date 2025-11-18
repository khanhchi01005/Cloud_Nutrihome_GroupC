from datetime import datetime
import json
import os
from flask import jsonify
from db import get_db_connection
import pymysql

def get_family_members_service(family_id):
    if not family_id:
        return {"status": "error", "message": "family_id is required"}

    conn = get_db_connection()
    cursor = conn.cursor()  # <-- KHÔNG truyền dictionary=True

    cursor.execute("""
        SELECT *
        FROM users
        WHERE family_id = %s
    """, (family_id,))

    members = cursor.fetchall()
    conn.close()

    # Loại bỏ password, convert datetime/date sang string
    processed_members = []
    for member in members:
        member_dict = dict(member.items())  # Row -> dict
        member_dict.pop("password", None)
        processed_members.append(member_dict)

    return {
        "status": "success",
        "members": processed_members
    }

def lookup_user_by_username_service(username):
    if not username:
        return {"status": "error", "message": "username is required"}

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM users
        WHERE username = %s
    """, (username,))

    user = cursor.fetchone()
    conn.close()

    if not user:
        return {"status": "error", "message": "User not found"}

    # Chuyển Row -> dict và loại bỏ password
    user_dict = dict(user.items())
    user_dict.pop("password", None)

    return {
        "status": "success",
        "user": user_dict
    }

def add_user_to_family_service(family_id, user_id):
    if not family_id or not user_id:
        return {"status": "error", "message": "family_id and user_id required"}

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users SET family_id = %s 
        WHERE user_id = %s
    """, (family_id, user_id))

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "User added to family successfully",
        "user_id": user_id,
        "family_id": family_id
    }
