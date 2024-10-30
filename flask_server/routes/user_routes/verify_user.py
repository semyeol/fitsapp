from flask import Blueprint, jsonify, request, session
from flask_server.models.user_model import User
from flask_server import db
from datetime import datetime

verify_user_bp = Blueprint('verify_user', __name__)

@verify_user_bp.route('/api/verify_user', methods=['POST'])
def verify_user():
    code_entered = request.get_json().get('code')
    
    # Assuming you have stored the user's email or ID in the session during registration or login
    user_email = session.get('user_email')
    if not user_email:
        return jsonify({'message': 'Session expired or invalid.'}), 401

    user = User.query.filter_by(email=user_email).first()
    if user is None:
        return jsonify({'message': 'User not found!'}), 404

    # Check if the code matches and is not expired
    if user.verify_token == code_entered and user.verify_token_expiration > datetime.utcnow():
        user.is_verified = True
        db.session.commit()
        return jsonify({'message': 'Email verified successfully!'}), 200
    else:
        return jsonify({'message': 'Invalid or expired code.'}), 400
