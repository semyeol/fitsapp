# clothing_routes.py
import os
from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from flask_server import db
from flask_server.models.clothing_model import Clothing
from flask_server.utils.background_removal import remove_background
from flask_server.utils.heic_to_png import heic_to_png
from flask_server.utils.image_folders import UPLOAD_FOLDER, PROCESSED_FOLDER

create_clothing_bp = Blueprint('create_clothing', __name__)

@create_clothing_bp.route('/api/create_clothing', methods=['POST'])
def create_clothing():

    # request.form is a dictionary containing the form data
    data = request.form()
    size = data['size']
    color = data['color']
    category = data['category']
    layer = data['layer']
    user_id = data['user_id']
    
    # request.files is a dictionary containing the uploaded files
    # although 'image' is not just a string, it's a key to a the name of a file
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # no special chars, filename matches that of a system file i.e. 'index.html', 
    filename = secure_filename(file.filename)
    
    # Save the uploaded image
    input_image_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(input_image_path)
    
    # Check if the uploaded file is a HEIC image
    if filename.lower().endswith('.heic'):
        # Convert HEIC to PNG
        # split once before the last period, '[0]' is the filename
        png_filename = filename.rsplit('.', 1)[0] + '.png'
        png_image_path = os.path.join(UPLOAD_FOLDER, png_filename)
        heic_to_png(input_image_path, png_image_path)
        os.remove(input_image_path)  # Remove the original HEIC file
        input_image_path = png_image_path
    
    # Process the image for background removal
    # Ensures processed_img_path has a '.png' extension
    processed_img_path = os.path.join(PROCESSED_FOLDER, 'processed_' + os.path.splitext(filename)[0] + '.png')
    remove_background(input_image_path, processed_img_path)

    new_clothing = Clothing(
        size=size,
        color=color,
        category=category,
        layer=layer,
        users_id=user_id,
        imge_url=processed_img_path
    )

    db.session.add(new_clothing)
    db.session.commit()
    return jsonify({'message': 'Clothing item created with image!'}), 201