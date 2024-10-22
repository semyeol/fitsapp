from flask import Blueprint, jsonify, request
from flask_server.models.user_model import User
from flask_server import db

# defines API endpoints related to user management

user_bp = Blueprint('user', __name__)

# call the User model to create a new user
@user_bp.route('/api/user', methods=['POST'])
def create_user():
    data = request.get_json()
    # no need to hash password again here
    # hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created!'}), 201

@user_bp.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'username': user.username} for user in users])
