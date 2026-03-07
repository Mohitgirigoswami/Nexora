import flask
from model import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from datetime import timedelta

App = flask.Flask(__name__)
CORS(App) # Enable CORS for all routes

# Configuration
App.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nexora.db'
App.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
App.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'nexora-secret-key-123')
App.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=180)

# Initialize extensions
db.init_app(App)
jwt = JWTManager(App)

# Create tables
with App.app_context():
    db.create_all()
