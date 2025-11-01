from datetime import datetime
import sqlite3
import json
import os
from flask import jsonify

# Connect to the SQLite database
DATABASE = os.path.join(os.path.dirname(os.getcwd()), 'nutrihome.db')