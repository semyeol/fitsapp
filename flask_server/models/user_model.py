from flask_server.extensions import db, bcrypt
from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # originally used 
    verify_token = db.Column(db.String, nullable=True)
    verify_token_expiration = db.Column(db.DateTime, nullable=True)
    is_verified = db.Column(db.Boolean, nullable=False, default=False)

    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    
    reset_token = db.Column(db.String, nullable=True)
    reset_token_expiration = db.Column(db.DateTime, nullable=True)

    # implemented 'check_password' in the model b/c it'll only be used for User model
    def __init__(self, email, username, password, is_admin=False):
        self.email = email
        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.is_admin = is_admin

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.username}>'
