from flask import current_app as app
from flask import Blueprint, jsonify, request, session
from flask_server.models.user_model import User
from flask_server import db

login_user_bp = Blueprint('login_user', __name__)
logout_user_bp = Blueprint('logout_user', __name__)

@login_user_bp.route('/api/login_user', methods=['POST'])
def login_user():
    data = request.get_json()

    # could be either email or username
    identifier = data.get('identifier')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'message': 'Missing username/email or password...'}), 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if user and user.check_password(password):
        return jsonify({'message': 'W login!'}), 200
    else:
        return jsonify({'message': 'Double check credentials...'}), 401

@logout_user_bp.route('/api/logout_user', methods=['POST'])
def logout_user():
    # log out by only removing user_id from session
    session.pop('user_id', None)
    return jsonify({'message': 'Bye bye!'}), 200