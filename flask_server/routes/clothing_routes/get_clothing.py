# clothing_routes.py
import os
from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from flask_server import db
from flask_server.models.clothing_model import Clothing
from flask_server.utils.background_removal import remove_background
from flask_server.utils.heic_to_png import heic_to_png

get_clothing_bp = Blueprint('get_clothing', __name__)

@get_clothing_bp.route('/api/get_clothing', methods=['GET'])
def get_clothing():
    clothing_items = Clothing.query.all()
    return jsonify([{
        'id': item.id,
        'size': item.size,
        'color': item.color,
        'category': item.category,
        'layer': item.layer,
        'user_id': item.users_id
    } for item in clothing_items])