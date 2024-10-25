import os
from PIL import Image
import pillow_heif
import logging

logging.basicConfig(level=logging.DEBUG)

def heic_to_png(heic_path, png_path):
    try:
        # Read the HEIC file using pillow_heif
        heif_file = pillow_heif.read_heif(heic_path)

        # Convert the HEIC data to a Pillow Image object
        image = Image.frombytes(
            heif_file.mode,
            heif_file.size,
            heif_file.data
        )

        # Convert the image to RGB if needed and save as PNG
        image = image.convert("RGB")
        image.save(png_path, "PNG")

        # Verify the saved PNG image
        with Image.open(png_path) as img:
            img.verify()  # Raises an error if the image is not valid
        logging.info("HEIC file successfully converted to PNG.")

    except Exception as e:
        logging.error(f"Error converting HEIC file to PNG: {e}")
        raise
