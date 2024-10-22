# base_routes.py
from flask import Blueprint, jsonify

# Define a blueprint for the base routes
base_bp = Blueprint('base', __name__)

@base_bp.route('/api/', methods=['GET'])
def index():
    return jsonify({'message': 'API is running'})
