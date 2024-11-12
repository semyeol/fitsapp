# __init__.py in routes folder
from flask import Flask
from flask_server.routes.base_routes import base_bp
from flask_server.routes.user_routes import user_bp
from flask_server.routes.clothing_routes import clothing_bp

def register_routes(app: Flask):
    app.register_blueprint(base_bp)
    app.register_blueprint(user_bp, url_prefix='/user') # all routes in user_bp will have '/user' prefix
    app.register_blueprint(clothing_bp, url_prefix='/clothing') # all routes in clothing_bp will have '/clothing' prefix
