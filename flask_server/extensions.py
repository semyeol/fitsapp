from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_mail import Mail
from flask_cors import CORS

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()  # Flask-Migrate for handling database migrations
login_manager = LoginManager()  # Flask-Login for handling user sessions
mail = Mail()  # Flask-Mail for sending emails
cors = CORS()  # Flask-CORS for handling Cross-Origin Resource Sharing

