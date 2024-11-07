from flask import Flask
from flask_server.config import config
from flask_server.extensions import db, bcrypt, migrate, login_manager, mail, CORS
from flask_server.routes import register_routes

# config_name specifies which configuration to use
def create_app(config_name):
    app = Flask(__name__)

    # Load configuration from config.py
    app.config.from_object(config[config_name])

    login_manager.init_app(app)

    bcrypt.init_app(app)
    
    # Initialize the database with the app
    db.init_app(app)

    migrate.init_app(app, db)

    mail.init_app(app)

    register_routes(app)

    CORS(app, supports_credentials=True)

    # Create the database tables if they don't exist
    with app.app_context():
        db.create_all()   

    return app
