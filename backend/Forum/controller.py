from flask import Blueprint
from .services import show_all_post
from .services import up_new_post 
from .services import up_new_comment
from .services import load_all_comment
from .services import react_post


forum = Blueprint("forum", __name__)

@forum.route("/api/forum", methods =['GET'])
def show_post():
    return show_all_post()

@forum.route("/api/forum/up_post", methods = ['POST'])
def up_post():
    return up_new_post()

@forum.route("/api/forum/comment", methods =['POST'])
def up_comment():
    return up_new_comment()

@forum.route("/api/forum/load_comment",methods=['GET'])
def load_comment():
    return load_all_comment()

@forum.route("/api/forum/react", methods = ['POST'])
def react():
    return react_post()