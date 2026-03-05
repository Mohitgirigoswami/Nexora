from app import App
from routes import register_routes
import routes
from dotenv import load_dotenv
load_dotenv()

register_routes(App)

if __name__ == "__main__":
    App.run(debug=True, port=8000)