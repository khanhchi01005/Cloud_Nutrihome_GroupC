from flask import Flask, request, jsonify
import sqlite3
import datetime
import json 
import logging
from datetime import datetime 
import os

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

DATABASE = os.path.join(os.path.dirname(os.getcwd()), 'nutrihome.db')
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def show_all_post():
    conn = get_db_connection()
    posts = conn.execute(
        '''SELECT post_id, username AS author, title, image, content
           FROM posts
           JOIN users 
           ON author_id = user_id
           ''').fetchall()
    conn.close()
    
    if posts:
        post_dict = {
            f"post_id = {post['post_id']}": {
                'author': post['author'],
                'title': post['title'],
                'image': post['image'],
                'content': post['content'],
            }
            for post in posts
        }
        return jsonify({
            'status': 'success',
            'data': post_dict
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'No posts found'
        }), 404
def up_new_post():
    data = request.json 
    title = data.get('title')
    content = data.get('content')
    image = data.get('image')
    author_id = data.get('author') 

    logger.debug(f"Received data: {data}")

    # Check if author exists
    with get_db_connection() as conn:
        author = conn.execute("SELECT user_id FROM users WHERE user_id = ?", (author_id,)).fetchone()

    if author:
        with get_db_connection() as conn:
            conn.execute("""
            INSERT INTO posts (title, content, image, created_at, author_id, total_reacts, comments)
            VALUES (?, ?, ?, date('now'), ?, 0, '{"comments":[]}')
            """, (title, content, image, author['user_id']))
            conn.commit()

        logger.debug(f"Post created with title: {title}, author_id: {author['user_id']}")

        return jsonify({
            'data': {
                'title': title,
                'content': content,
                'image': image, 
                'author': author['user_id'],
                'created_at': datetime.now().isoformat(),
            },
            'status': 'success',
            'message': 'You have just posted a new recipe. Viral now!'
        }), 200
    else:
        logger.error(f"Author with id {author_id} not found")
        return jsonify({'status': 'error', 'message': 'Failed to post a new recipe, user not found'}), 404


def up_new_comment():
    data = request.json
    post_id = data.get('post_id')
    user_id = data.get('user_id')  
    comment = data.get('comment')
    
    if not post_id or not user_id:
        return jsonify({'status': 'error', 'message': 'Post ID and user ID are required'}), 400

    conn = get_db_connection()

    user = conn.execute("SELECT username, avatar FROM users WHERE user_id = ?", (user_id,)).fetchone()
    
    if not user:
        conn.close()
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    username = user['username']
    avatar = user['avatar'] 
    post = conn.execute("SELECT comments FROM posts WHERE post_id = ?", (post_id,)).fetchone()
    
    if not post:
        conn.close()
        return jsonify({'status': 'error', 'message': 'Post not found'}), 404

    comments = json.loads(post['comments'])['comments'] 
    new_comment = {
        "username": username,
        "avatar": avatar,
        "comment": comment,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    comments.append(new_comment)

    updated_comments_json = json.dumps({"comments": comments})
    conn.execute("UPDATE posts SET comments = ? WHERE post_id = ?", (updated_comments_json, post_id))
    conn.commit()
    conn.close()

    return jsonify({
        'status': 'success',
        'message': 'Comment added successfully'
    }), 200

def load_all_comment():
    data = request.json 
    post_id = data.get('post_id')
    conn = get_db_connection()
    post = conn.execute("SELECT comments FROM posts WHERE post_id = ?", (post_id,)).fetchone()
    conn.close()
    
    return jsonify({
        'status': 'success',
        'data': json.loads(post['comments'])
    }), 200
    
def react_post():
    data = request.json
    post_id = data.get('post_id')
    
    conn = get_db_connection()
    post = conn.execute("SELECT * FROM posts WHERE post_id = ?", (post_id,)).fetchone()
    conn.close()
    
    if post:
        conn = get_db_connection()
        conn.execute("UPDATE posts SET total_reacts = total_reacts + 1 WHERE post_id = ?", (post_id,))
        conn.commit()
        conn.close()
    
        return jsonify({
            'status': 'success',
            'data': {
                'total_reacts': post['total_reacts'] + 1
            }
        })
    else:
        return jsonify({
            'status': 'error',
            'message': 'Post not found'
        }), 404