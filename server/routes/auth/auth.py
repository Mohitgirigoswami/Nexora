from flask import blueprints
from flask import request
from ...model import User,OTP,db

authbp = blueprints.Blueprint(name = "Auth", import_name=__name__)
authbp.route("/auth/register", methods=["POST"])
def register(request):
    email = request.form.get("email")
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    user = User.query.filter_by(email=email).first()
    if user:
        if user.is_verified == False:
            db.session.delete(user)
            db.session.commit()
        else : 
            return {
                "msg" : "registration failed",
                "error": "Email already registered"}, 400
    try : 
        user = User(email=email, first_name=first_name, last_name=last_name)
        db.session.add(user)
        db.session.commit()
        return {
            "msg" : "registeration done"
        },200
    except :
        return {
            "msg" : "registration failed",
            "error": "Internal server error"}, 500

authbp.route("/auth/login", methods=["POST"])
def login(request):
    
    return "Login"

authbp.route("/auth/send-verification-email", methods=["POST"])
def send_verification_email():
    return "Send Verification Email"