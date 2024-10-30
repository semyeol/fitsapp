from flask import Blueprint, jsonify, request, session
from flask_server.models.user_model import User
from flask_server.utils.verification_code_generator import generate_verification_code, send_verification_email
from flask_server import db
from datetime import datetime, timedelta
from flask import current_app as app

# defines API endpoints related to user management

create_user_bp = Blueprint('create_user', __name__)
get_users_bp = Blueprint('get_user', __name__)

# call the User model to create a new user
@create_user_bp.route('/api/create_user', methods=['POST'])
def create_user():
    data = request.get_json()

    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({'message': 'Missing data!'}), 400
    
    new_user = User(email=email, username=username, password=password)

    new_user.verify_token = generate_verification_code(email)
    new_user.verify_token_expiration = datetime.utcnow() + timedelta(minutes=10)

    db.session.add(new_user)
    db.session.commit()

    # store user email in session
    # this way, user does not need to reenter email--just the verification code
    session['user_email'] = email
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=10)

    send_verification_email(new_user)
    
    return jsonify({'message': 'User created!'}), 201

##############################################

@get_users_bp.route('/api/get_users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'username': user.username} for user in users])
