# clothing_routes.py
# import os
from flask import Blueprint, jsonify, request
from flask_server import db
from flask_server.models.clothing_model import Clothing

get_clothing_bp = Blueprint('get_clothing', __name__)

@get_clothing_bp.route('/api/get_clothing', methods=['GET'])
def get_clothing():
    # request.args reps the query parameters in the URL after the '?' i.e. '?size=M&color=blue.'
    size = request.args.get('size') # if finds 'size' in query params, returns the value, otherwise return None 
    color = request.args.get('color')
    category = request.args.get('category')
    layer = request.args.get('layer')
    user_id = request.args.get('user_id')

    # specific filters
    query = Clothing.query
    # check if var has a value (did the user request this var?)
    if size:
        query = query.filter_by(size=size)
    if color:
        query = query.filter_by(color=color)
    if category:
        query = query.filter_by(category=category)
    if layer:
        query = query.filter_by(layer=layer)
    if user_id:
        query = query.filter_by(users_id=user_id)

    # if no filters specified, return all clothing items
    clothing_items = Clothing.query.all()
    return jsonify([{
        'id': item.id,
        'size': item.size,
        'color': item.color,
        'category': item.category,
        'layer': item.layer,
        'user_id': item.users_id
    } for item in clothing_items])