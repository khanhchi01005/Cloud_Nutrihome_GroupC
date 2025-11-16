import pymysql
from dbutils.pooled_db import PooledDB

db_pool = PooledDB(
    creator=pymysql,
    host="localhost",
    user="root",
    password="123456",
    database="nutrihome",
    port=3306,
    charset="utf8mb4",
    maxconnections=10
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