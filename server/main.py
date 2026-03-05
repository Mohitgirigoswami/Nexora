from app import App
import routes
from dotenv import load_dotenv
load_dotenv()
if __name__ == "__main__":
    App.run(debug=True, port=8000)