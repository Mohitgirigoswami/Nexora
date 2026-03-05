from auth import authbp

def register_routes(app):
    app.register_blueprint(authbp)