import flask
from model import db
from flask_jwt_extended import JWTManager
import os

App = flask.Flask(__name__)

# Configuration
App.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nexora.db'
App.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
App.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'nexora-secret-key-123')

# Initialize extensions
db.init_app(App)
jwt = JWTManager(App)

# Create tables
with App.app_context():
    db.create_all()
