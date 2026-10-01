from dotenv import load_dotenv

load_dotenv()

from app import App
from routes import register_routes
import routes

register_routes(App)

if __name__ == "__main__":
    App.run(debug=True, port=8000)