# serializer generates secure token 
from itsdangerous import URLSafeTimedSerializer
# 'url_for' from Flask framework, generates URLs based on routes
from flask import current_app, url_for
from flask_mail import Mail, Message
import datetime

mail = Mail()  # Initialize Flask-Mail

def generate_verification_token(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='email-confirm-salt')

def send_verification_email(user):
    token = generate_verification_token(user.email)
    verification_url = url_for('verify_user', token=token, _external=True)
    msg = Message(subject="Please verify your email",
                  sender=current_app.config['MAIL_DEFAULT_SENDER'],
                  recipients=[user.email])
    msg.body = f'Click the link to verify your email: {verification_url}'
    mail.send(msg)