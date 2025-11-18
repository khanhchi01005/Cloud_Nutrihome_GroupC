import os
from dotenv import load_dotenv
import pymysql
from dbutils.pooled_db import PooledDB

load_dotenv()

MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_DB = os.getenv('MYSQL_DB')

db_pool = PooledDB(
    creator=pymysql,
    host=MYSQL_HOST,
    user=MYSQL_USER,
    password=MYSQL_PASSWORD,
    database=MYSQL_DB,
    port=MYSQL_PORT,
    charset="utf8mb4"
)

def get_db_connection():
    return db_pool.connection()

def test_connection():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT VERSION()")
    print("MySQL version:", cursor.fetchone())
    cursor.close()
    conn.close()

if __name__ == "__main__":
    test_connection()
