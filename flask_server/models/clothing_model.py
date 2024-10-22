from sqlalchemy import Enum
from flask_server import db

# tables in database

class Clothing(db.Model):
    __tablename__ = 'clothing'
    id = db.Column(db.Integer, primary_key=True)
    size = db.Column(db.String(5), nullable=False)
    color = db.Column(db.String(20), nullable=False)
    # Enum raises error if val is not one of the specified
    # 'name=' is needed for Enum
    category = db.Column(Enum('top', 'bottom', 'shoes', 'headwear', name='clothing_category'), nullable=False)
    layer = db.Column(Enum('inner', 'outer', name='top_layer'), nullable=False)
    # relationship between clothing piece and user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
