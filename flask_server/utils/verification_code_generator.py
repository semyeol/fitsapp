# 'url_for' from Flask framework, generates URLs based on routes
from flask import current_app
from flask_server.extensions import mail
from flask_mail import Message
import os
import hashlib

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
    code = generate_verification_code(user.email)
    # verification_url = url_for('verify_user', token=code, _external=True)
    msg = Message(subject="Please verify your email",
                  sender=current_app.config['MAIL_DEFAULT_SENDER'],
                  recipients=[user.email])
    msg.body = f'Your verification code is: {code}'
    mail.send(msg)