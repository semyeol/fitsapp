from flask import Blueprint, jsonify, request
from flask_server import db
from flask_server.models.clothing_model import Clothing
from flask_server.routes.clothing_routes.clothing_bp import clothing_bp

@clothing_bp.route('/api/delete_clothing<int:id>', methods=['DELETE'])
def delete_clothing(id):
    clothing_piece = Clothing.query.get(id)

    if clothing_piece is None:
        return jsonify({'error': 'Clothing item not found'}), 404

    db.session.delete(clothing_piece)
    db.session.commit()

    return jsonify({'message': 'Clothing item deleted successfully'}), 200