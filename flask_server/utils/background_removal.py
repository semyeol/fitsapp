from rembg import remove
import numpy as np
import cv2

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
