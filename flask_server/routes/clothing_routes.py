# clothing_routes.py
import os
from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from flask_server import db
from flask_server.models.clothing_model import Clothing
from flask_server.utils.background_removal import remove_background
from flask_server.utils.heic_to_png import heic_to_png
from PIL import Image

clothing_bp = Blueprint('clothing', __name__)

# create folders to store imgs
UPLOAD_FOLDER = 'uploads/'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
PROCESSED_FOLDER = 'uploads_processed/'
if not os.path.exists(PROCESSED_FOLDER):
    os.makedirs(PROCESSED_FOLDER)

@clothing_bp.route('/api/clothing', methods=['POST'])
def create_clothing():

    # request.form is a dictionary containing the form data
    data = request.form()
    size = data['size']
    color = data['color']
    category = data['category']
    layer = data['layer']
    user_id = data['user_id']
    
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # secure_filename removes any special characters from the filename
    filename = secure_filename(file.filename)

    # split at '.' & [1] extracts the file extension
    file_ext = filename.split('.', 1)[1].lower()

    # construct the path to save the image
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(image_path)

    if file_ext == 'heic':
        png_file = filename.split('.', 1)[0] + '.png'
        png_path = os.path.join(UPLOAD_FOLDER, png_file)
        heic_to_png(image_path, png_path)
        
        try:
            with Image.open(png_path) as img:
                img.load()
            print(f"Verified PNG file is valid: {png_path}")
        except Exception as e:
            return jsonify({'error': 'Converted image is not valid'}), 400

        # remove the original heic file
        os.remove(image_path) 
        
        # set path to the new png file
        image_path = png_path

    # construct the path to save the processed image
    processed_img_path = os.path.join(PROCESSED_FOLDER, 'nobg_' + filename)
    remove_background(image_path, processed_img_path)

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
    return jsonify({'message': 'Clothing item created!'}), 201

@clothing_bp.route('/api/clothing', methods=['GET'])
def get_clothing():
    clothing_items = Clothing.query.all()
    return jsonify([{
        'id': item.id,
        'size': item.size,
        'color': item.color,
        'category': item.category,
        'layer': item.layer,
        'user_id': item.users_id
    } for item in clothing_items])

# test background removal
@clothing_bp.route('/api/test_background_removal', methods=['POST'])
def test_background_removal():
    # Upload and test the image removal
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    filename = secure_filename(file.filename)
    
    input_image_path = os.path.join(UPLOAD_FOLDER, filename)
    output_image_path = os.path.join(PROCESSED_FOLDER, 'processed_' + filename)
    
    # Save the uploaded image
    file.save(input_image_path)
    
    # Run background removal
    remove_background(input_image_path, output_image_path)
    
    return jsonify({'message': 'Background removed', 'processed_image_url': output_image_path}), 200
