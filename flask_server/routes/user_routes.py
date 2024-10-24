from flask import Blueprint, jsonify, request
from flask_server.models.user_model import User
from flask_server import db

# defines API endpoints related to user management

user_bp = Blueprint('user', __name__)

# call the User model to create a new user
@user_bp.route('/api/user', methods=['POST'])
def create_user():
    data = request.get_json()

    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({'message': 'Missing data!'}), 400
    
    new_user = User(email=email, username=username, password=password)

    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created!'}), 201

@user_bp.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'username': user.username} for user in users])
