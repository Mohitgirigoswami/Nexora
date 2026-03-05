from app import App

App.route("/auth/login", methods=["POST"])
def login():
    return "Login"

App.route("/auth/register", methods=["POST"])
def register():
    return "Register"

App.route("/auth/send-verification-email", methods=["POST"])
def send_verification_email():
    return "Send Verification Email"