from flask import Blueprint
from .create_user import create_user_bp, get_users_bp

user_bp = Blueprint('user', __name__)

user_bp.register_blueprint(create_user_bp)
user_bp.register_blueprint(get_users_bp)
