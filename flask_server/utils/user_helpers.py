# 'url_for' from Flask framework, generates URLs based on routes
from flask import current_app, request, jsonify
from flask_server.extensions import mail
from flask_mail import Message
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from flask_server.extensions import db
from smtplib import SMTPException
import logging
from functools import wraps
import jwt
from flask_server.models.user_model import User

# mail = Mail()  # Initialize Flask-Mail

# in user_model, i used bcrypt to hash the password
# here, using sha256 bc it's faster and we don't need to decrypt it

# originally used itsdangerous to generate the token, but sha256 is better suited for generating 5 digit codes

def generate_verification_code(email):
    # hash input = email + secret key
    data = email + os.getenv('SECRET_KEY', 'default_secret_key')

    hash_object = hashlib.sha256(data.encode())
    hex_dig = hash_object.hexdigest()

    code = int(hex_dig, 16) % 1000000 # use 10^6 as modulus to limit hash to 6 digits (0 to 999999)
    # review how to hexadecimal to int ^^
    return f"{code:06d}" # pad with zeros to ensure 6 digits

def send_verification_email(user):
    try:
        code = generate_verification_code(user.email)
        user.verify_token = code
        user.verify_token_expiration = datetime.utcnow() + timedelta(minutes=10)
        
        msg = Message(subject="Sem's Closet: Verify your email",
                    sender=current_app.config['MAIL_DEFAULT_SENDER'],
                    recipients=[user.email])
        msg.body = f'Verification code is: {code}'
        
        print(f"Attempting to send email to {user.email} with code {code}")
        print(f"Mail settings: MAIL_SERVER={current_app.config['MAIL_SERVER']}, MAIL_PORT={current_app.config['MAIL_PORT']}")
        print(f"Using sender: {current_app.config['MAIL_DEFAULT_SENDER']}")
        
        mail.send(msg)
        print("Email sent successfully!")
        
    except SMTPException as e:
        print(f"Failed to send email: {str(e)}")
        # Still return success to client but log the error
        logging.error(f"Failed to send verification email to {user.email}: {str(e)}")
    except Exception as e:
        print(f"Unexpected error sending email: {str(e)}")
        logging.error(f"Unexpected error sending verification email to {user.email}: {str(e)}")

def generate_reset_token():
    return secrets.token_urlsafe(32)

def send_password_reset_email(user, reset_token):
    try:
        msg = Message(subject="Sem's Closet: Reset your password",
                      sender=current_app.config['MAIL_DEFAULT_SENDER'],
                      recipients=[user.email])
        
        # Use the JWT token in the reset URL
        reset_url = f'{current_app.config["CLIENT_URL"]}reset-password?token={reset_token}'

        msg.body = f'Reset your password here: {reset_url}'
        msg.html = f'''
            <p>Click the link below to reset your password:</p>
            <a href="{reset_url}">
                Reset your password
            </a>
            <p>If the link doesn't work, copy and paste the following URL into your browser:</p>
            <p>{reset_url}</p>
            <p>This link will expire in 1 hour.</p>
        '''
        
        print(f"Attempting to send password reset email to {user.email}")
        print(f"Mail settings: MAIL_SERVER={current_app.config['MAIL_SERVER']}, MAIL_PORT={current_app.config['MAIL_PORT']}")
        print(f"Using sender: {current_app.config['MAIL_DEFAULT_SENDER']}")
        
        mail.send(msg)
        print("Password reset email sent successfully!")
        
    except SMTPException as e:
        print(f"Failed to send password reset email: {str(e)}")
        logging.error(f"Failed to send password reset email to {user.email}: {str(e)}")
        raise
    except Exception as e:
        print(f"Unexpected error sending password reset email: {str(e)}")
        logging.error(f"Unexpected error sending password reset email to {user.email}: {str(e)}")
        raise

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
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated
