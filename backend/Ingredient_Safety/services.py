from flask import Flask, request, jsonify
import sqlite3
import datetime
import json 
import logging
import easyocr
import os
import json
from dotenv import load_dotenv
import requests


DATABASE = os.path.join(os.path.dirname(os.getcwd()), 'nutrihome.db')
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def upload_label(data):
    user_id = data.get('user_id')
    image_path = data.get('image_path')
    
    conn = get_db_connection()
    allergen = conn.execute(
    '''SELECT allergen
    FROM users WHERE user_id = ?''',(user_id)).fetchone ()
    conn.close()
    
    allergen = allergen['allergen']
    print(allergen)
    
    # Khởi tạo EasyOCR reader
    
    reader = easyocr.Reader(['vi'])

    results = reader.readtext(image_path, detail=0)

    all_text = ''
    for idx, text in enumerate(results, 1):
        all_text += text + " "


    load_dotenv()
    API_KEY = os.getenv("GEMINI_API_KEY")
    API_URL = os.getenv("GEMINI_API_URL")
    
    headers = {
        'Content-Type': 'application/json',
    }

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""From the product label of the product.: {all_text}
                        I am allergic to these allergen, please warn me if there is any substance that may be dangerous to my allergy.: {allergen}
                        You just need to list the allergen in Vietnamese and do not need to explain anything.
                        Example: "
                        Sữa,
                        Đậu nành
                        "
                        """
                    }
                ]
            }
        ]
    }
    print(API_URL)
    response = requests.post(API_URL, headers=headers, data=json.dumps(data), params={"key": API_KEY})
    

    if response.status_code == 200:
        response_data = response.json()
        result = response_data['candidates'][0]['content']['parts'][0]['text']
        return result, 200
    else:
        return f"Lỗi khi gọi API Gemini: {response.status_code}", 400