import os

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