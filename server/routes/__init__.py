from .auth.auth import authbp
from .genai.routes import genai_bp
from .main.main import main_bp

def register_routes(app):
    app.register_blueprint(authbp, url_prefix='/auth')
    app.register_blueprint(genai_bp, url_prefix='/genai')
    app.register_blueprint(main_bp, url_prefix='/main')
