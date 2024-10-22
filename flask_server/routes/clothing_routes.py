# clothing_routes.py
from flask import Blueprint, jsonify, request
from flask_server import db
from flask_server.models.clothing_model import Clothing

clothing_bp = Blueprint('clothing', __name__)

@clothing_bp.route('/api/clothing', methods=['POST'])
def create_clothing():
    data = request.get_json()
    new_clothing = Clothing(
        size=data['size'],
        color=data['color'],
        category=data['category'],
        layer=data['layer'],
        users_id=data['user_id']
    )
    db.session.add(new_clothing)
    db.session.commit()
    return jsonify({'message': 'Clothing item created!'}), 201

@clothing_bp.route('/api/clothing', methods=['GET'])
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
