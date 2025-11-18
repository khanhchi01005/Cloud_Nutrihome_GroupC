import os
from dotenv import load_dotenv
import pymysql
from pymysql.cursors import Cursor

# Load file .env
load_dotenv()  # mặc định đọc .env ở thư mục hiện tại

MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_DB = os.getenv('MYSQL_DB')


class Row(tuple):
    def __new__(cls, values, columns):
        obj = tuple.__new__(cls, values)
        obj._columns = list(columns)
        return obj

    def __getitem__(self, key):
        if isinstance(key, str):
            try:
                idx = self._columns.index(key)
            except ValueError:
                raise KeyError(key)
            return tuple.__getitem__(self, idx)
        return tuple.__getitem__(self, key)

    def get(self, key, default=None):
        try:
            return self[key]
        except KeyError:
            return default

    def keys(self):
        return list(self._columns)

    def items(self):
        return [(k, self[k]) for k in self._columns]


class DBCursorWrapper:
    def __init__(self, cursor):
        self._cur = cursor

    def execute(self, sql, params=None):
        # Convert sqlite-style ? placeholders to %s
        if params is None:
            params = ()
        sql = sql.replace('?', '%s')
        return self._cur.execute(sql, params)

    def fetchone(self):
        row = self._cur.fetchone()
        if row is None:
            return None
        columns = [d[0] for d in self._cur.description]
        return Row(tuple(row), columns)

    def fetchall(self):
        rows = self._cur.fetchall()
        if rows is None:
            return []
        columns = [d[0] for d in self._cur.description]
        return [Row(tuple(r), columns) for r in rows]

    @property
    def lastrowid(self):
        return self._cur.lastrowid


class DBConnection:
    def __init__(self, conn):
        self._conn = conn

    def execute(self, sql, params=None):
        cur = self._conn.cursor()
        wrapper = DBCursorWrapper(cur)
        wrapper.execute(sql, params)
        return wrapper

    def cursor(self):
        cur = self._conn.cursor()
        return DBCursorWrapper(cur)

    def commit(self):
        self._conn.commit()

    def close(self):
        self._conn.close()

    # Context manager support
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        try:
            if exc_type is None:
                self._conn.commit()
        finally:
            self.close()


def get_db_connection():
    conn = pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        cursorclass=Cursor,
        autocommit=False,
        charset='utf8mb4'
    )
    return DBConnection(conn)