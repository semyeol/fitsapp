from flask import Blueprint, jsonify, request, session
from flask_server.models.user_model import User
from flask_server.utils.user_helpers import generate_verification_code, send_verification_email, send_password_reset_email
from flask_server import db
from datetime import datetime, timedelta
from flask import current_app as app
import jwt
from functools import wraps

# defines API endpoints related to user management

user_bp = Blueprint('user', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing!'}), 401

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Verify the token using your secret key
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# call the User model to create a new user
@user_bp.route('/create_user', methods=['POST'])
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

    try:
        db.session.add(new_user)
        db.session.commit()

        # store user email in session
        # this way, user does not need to reenter email--just the verification code
        session['user_email'] = email
        session.permanent = True
        app.permanent_session_lifetime = timedelta(minutes=10)

        send_verification_email(new_user)

        return jsonify({'message': 'Verify your email!'}), 201

    # catches SQLAlchemy IntegrityError
    except IntegrityError as e:
        db.session.rollback()
        if 'user_email_key' in str(e):
            return jsonify({'message': 'Email already registered...', 'field': 'email'}), 409
        elif 'user_username_key' in str(e):
            return jsonify({'message': 'Username is taken...', 'field': 'username'}), 409
        return jsonify({'message': 'Error creating account...'}), 400
    
    # catches other general exceptions
    except Exception as e:
        # undo the failed DB operation
        db.session.rollback()
        return jsonify({'message': 'Error creating account...'}), 500

@user_bp.route('/verify_user', methods=['POST'])
def verify_user():
    code_entered = request.get_json().get('code')
    
    # Assuming you have stored the user's email or ID in the session during registration or login
    user_email = session.get('user_email')
    if not user_email:
        return jsonify({'message': 'Session expired or invalid...'}), 401

    user = User.query.filter_by(email=user_email).first()
    if user is None:
        return jsonify({'message': 'User not found...'}), 404

    # Check if the code matches and is not expired
    if user.verify_token == code_entered and user.verify_token_expiration > datetime.utcnow():
        user.is_verified = True
        db.session.commit()
        return jsonify({'message': 'W email verification!'}), 200
    else:
        return jsonify({'message': "Your code's wrong or it's expired..."}), 400

@user_bp.route('/resend_verification_email', methods=['POST'])
def resend_verification_email():
    user_email = session.get('user_email')
    if not user_email:
        return jsonify({'message': 'Session expired or invalid...'}), 401

    user = User.query.filter_by(email=user_email).first()
    if user is None:
        return jsonify({'message': 'User not found...'}), 404

    user.verify_token = generate_verification_code(user_email)
    user.verify_token_expiration = datetime.utcnow() + timedelta(minutes=10)
    db.session.commit()

    send_verification_email(user)

    return jsonify({'message': 'Resent verification email!'}), 200

@user_bp.route('/login_user', methods=['POST'])
def login_user():
    data = request.get_json()

    # could be either email or username
    identifier = data.get('identifier')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'message': 'Missing username/email or password...'}), 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if user and user.check_password(password):
        # Generate token without expiration
        token = jwt.encode({
            'user_id': user.id
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': 'W login!',
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
    else:
        return jsonify({'message': 'Double check credentials...'}), 401

@user_bp.route('/validate-token', methods=['GET'])
@token_required
def validate_token(current_user):
    # If we get here, the token is valid (because of @token_required decorator)
    return jsonify({
        'isValid': True,
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email
        }
    })

@user_bp.route('/logout_user', methods=['POST'])
@token_required
def logout_user(current_user):
    # log out by only removing user_id from session
    session.pop('user_id', None)
    return jsonify({'message': 'Bye bye!'}), 200

@user_bp.route('/reset_password_link', methods=['POST'])
def reset_password_link():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Enter your email...'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user: 
        return jsonify({'message': 'Email not found...'}), 404

    # Generate a temporary reset token that expires in 1 hour
    reset_token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(hours=1),
        'purpose': 'password_reset'
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    # Send reset email with the token
    send_password_reset_email(user, reset_token)
    return jsonify({'message': 'Reset password link sent!'}), 200

@user_bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    reset_token = data.get('token')
    new_password = data.get('new_password')

    if not reset_token or not new_password:
        return jsonify({'message': 'Missing token or new password'}), 400

    try:
        # Verify the reset token
        payload = jwt.decode(reset_token, app.config['SECRET_KEY'], algorithms=["HS256"])
        
        # Check if this is a password reset token
        if payload.get('purpose') != 'password_reset':
            return jsonify({'message': 'Invalid reset token'}), 400

        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Update password
        user.set_new_password(new_password)
        db.session.commit()

        return jsonify({'message': 'Password reset successful!'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Reset token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid reset token'}), 400

@user_bp.route('/set_new_password', methods=['POST'])
@token_required
def set_new_password(current_user):
    data = request.get_json()

    new_password = data.get('new_password')

    if not new_password:
        return jsonify({'message': 'Enter a new password...'}), 400

    current_user.set_new_password(new_password)
    db.session.commit()
    return jsonify({'message': 'Password reset!'}), 200