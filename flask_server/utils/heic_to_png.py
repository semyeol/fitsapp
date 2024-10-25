from PIL import Image
import pyheif
import logging

logging.basicConfig(level=logging.DEBUG)


def heic_to_png(heic_path, png_path):
    try:
        heif_file = pyheif.read(heic_path)
        image = Image.frombytes(
            heif_file.mode, 
            heif_file.size, 
            heif_file.data,
            "raw",
            heif_file.mode,
            heif_file.stride,
        ).convert("RGB")

        image.save(png_path, "PNG")

        with Image.open(png_path) as img:
            img.verify()  # Raises an error if the image is not valid
        logging.info("HEIC file successfully converted to PNG.")
    except Exception as e:
        logging.error("Error converting HEIC file to PNG: {e}")
        raise