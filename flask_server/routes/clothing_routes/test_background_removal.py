# clothing_routes.py
import os
from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from flask_server import db
from flask_server.models.clothing_model import Clothing
from flask_server.routes.clothing_routes.clothing_bp import clothing_bp
from flask_server.utils.upload_clothing_helpers import remove_background, heic_to_png, UPLOAD_FOLDER, PROCESSED_FOLDER
# from flask_server.utils.background_removal import remove_background
# from flask_server.utils.heic_to_png import heic_to_png
# from flask_server.utils.image_folders import UPLOAD_FOLDER, PROCESSED_FOLDER

@clothing_bp.route('/api/test_bg_removal', methods=['POST'])
def test_background_removal():
    # Upload and test the image removal
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    filename = secure_filename(file.filename)
    
    # Save the uploaded image
    input_image_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(input_image_path)
    
    # Check if the uploaded file is a HEIC image
    if filename.lower().endswith('.heic'):
        # Convert HEIC to PNG
        png_filename = filename.rsplit('.', 1)[0] + '.png'
        png_image_path = os.path.join(UPLOAD_FOLDER, png_filename)
        heic_to_png(input_image_path, png_image_path)
        os.remove(input_image_path)  # Remove the original HEIC file
        input_image_path = png_image_path
    
    # Process the image for background removal
    # Ensures processed_img_path has a '.png' extension
    processed_img_path = os.path.join(PROCESSED_FOLDER, 'processed_' + os.path.splitext(filename)[0] + '.png')
    remove_background(input_image_path, processed_img_path)
    
    return jsonify({'message': 'Background removed', 'processed_image_url': processed_img_path}), 200
