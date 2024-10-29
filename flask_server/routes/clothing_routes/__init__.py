from flask import Blueprint
from .create_clothing import create_clothing_bp
from .get_clothing import get_clothing_bp
from .delete_clothing import delete_clothing_bp
from .test_background_removal import test_background_removal_bp

clothing_bp = Blueprint('clothing', __name__)

# Register all the blueprints for clothing-related routes
clothing_bp.register_blueprint(create_clothing_bp)
clothing_bp.register_blueprint(get_clothing_bp)
clothing_bp.register_blueprint(delete_clothing_bp)
clothing_bp.register_blueprint(test_background_removal_bp)



