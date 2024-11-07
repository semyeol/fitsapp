from dotenv.main import load_dotenv
import os

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # essential for Flask forms 
    CSRF_ENABLED = True
    # controls complexity of password hashing using Bcrypt
    # needed for user authentication
    BCRYPT_LOG_ROUNDS = 13
    WTF_CSRF_ENABLED = True

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv('MAIL_DEFAULT_SENDER')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://sem:secret@localhost/clothingappdb'
    WTF_CSRF_ENABLED = False
    HOST = '0.0.0.0'
    PORT = 5000
    

# class ProductionConfig(Config):
    # DEBUG = False
    # SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', '')

# class TestingConfig(Config):
    # TESTING = True
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'

config = {
    'development': DevelopmentConfig,
    # 'production': ProductionConfig,
    # 'testing': TestingConfig
}
