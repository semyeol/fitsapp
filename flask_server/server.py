from flask_server import create_app

# Get the configuration (development, production, testing)
# create_app from __init__.py
app = create_app('development')

if __name__ == "__main__":
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=True)
