from rembg import remove
import numpy as np
import cv2
from PIL import Image
import pillow_heif
import logging
import os

# input_image_path = 'uploads/image.jpg'
# output_image_path = 'uploads_processed/nobg_image.jpg'

def remove_background(input_image_path, output_image_path):
    """
    Removes the background from an image using rembg and saves the processed image.

    :param input_image_path: The path to the original image.
    :param output_image_path: The path where the processed image will be saved.
    """
    # open the img in binary mode (needed for handling images or non-text files)
    with open(input_image_path, 'rb') as input_file:
        input_data = input_file.read()

    # remove the background using rembg
    result = remove(input_data)

    # binary data to np array of type uint8 (format for cv2)
    result_image = np.frombuffer(result, dtype=np.uint8)
    # convert the result back to an image format
    # 'cv2.IMREAD_UNCHANGED' ensures img is read w its original properties
    image = cv2.imdecode(result_image, cv2.IMREAD_UNCHANGED)

    # Save the processed image
    cv2.imwrite(output_image_path, image)

# logging.basicConfig(level=logging.DEBUG)

def heic_to_png(input_image_path, png_image_path):
    try:
        # Read the HEIC file using pillow_heif
        heif_file = pillow_heif.read_heif(input_image_path)

        # Convert the HEIC data to a Pillow Image object
        image = Image.frombytes(
            heif_file.mode,
            heif_file.size,
            heif_file.data
        )

        # Convert the image to RGB if needed and save as PNG
        image = image.convert("RGB")
        image.save(png_image_path, "PNG")

        # Verify the saved PNG image
        with Image.open(png_image_path) as img:
            img.verify()  # Raises an error if the image is not valid
        logging.info("HEIC file successfully converted to PNG.")

    except Exception as e:
        logging.error(f"Error converting HEIC file to PNG: {e}")
        raise


UPLOAD_FOLDER = 'uploads/'
PROCESSED_FOLDER = 'uploads_processed/'

def create_image_folders():
    """
    Create folders to store uploaded and processed images if they don't exist.
    """
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    if not os.path.exists(PROCESSED_FOLDER):
        os.makedirs(PROCESSED_FOLDER)

create_image_folders()

# importing this module allows use of the UPLOAD_FOLDER and PROCESSED_FOLDER variables