from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from model import User, OTP, db
from app import jwt
from utility.utility import check_password_strength,send_email
authbp = Blueprint("Auth", __name__)
import uuid
from datetime import datetime, timedelta

@authbp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or request.form
    
    email = data.get("email")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    password = data.get("password")

    if not all([email, first_name, last_name, password]):
        return jsonify({
            "msg": "registration failed",
            "error": "Missing required fields"
        }), 400

    user = User.query.filter_by(email=email).first()
    if user:
        if not user.is_verified:
            db.session.delete(user)
            db.session.commit()
        else:
            return jsonify({
                "msg": "registration failed",
                "error": "Email already registered"
            }), 400

    try:
        if not check_password_strength(password):
            return jsonify({
                "msg": "registration failed",
                "error": "Password does not meet strength requirements"
            }), 400
        new_user = User(
            email=email, 
            first_name=first_name, 
            last_name=last_name
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "msg": "registration done",
            "user": new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "registration failed",
            "error": str(e)
        }), 500

@authbp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or request.form
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400
        
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return jsonify({"msg": "Login successful", "user": user.to_dict(),"jwt" : create_access_token(identity=str(user.id))}), 200
        
    return jsonify({"msg": "Invalid credentials"}), 401

@authbp.route("/send-verification-email", methods=["POST"])
def send_verification_email():
        data = request.get_json() or request.form
        email = data.get("email")
        
        if not email:
            return jsonify({"msg": "Email is required"}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        if user.is_verified:
            return jsonify({"msg": "User already verified"}), 400
        
        otp_code = str(uuid.uuid4().int)[:6]  # Generate a random 6-digit OTP
        expires_at = datetime.now() + timedelta(minutes=10)  # OTP expires in 10 minutes
        
        otp_entry = OTP(user_id=user.id, otp_code=otp_code, expires_at=expires_at)
        db.session.add(otp_entry)
        db.session.commit()
        
        email_sent = send_email(
            to_email=email,
            subject="Nexora Email Verification",
            body=f"""
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; text-align: center;">Welcome to Nexora!</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Thank you for registering with Nexora. To complete your email verification, please use the OTP code below:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; background-color: #007bff; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 2px;">
                            {otp_code}
                        </span>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        This code will expire in <strong>10 minutes</strong>. If you didn't request this verification, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        Nexora - Your AI-Powered Roadmap Planner
                    </p>
                </div>
            </body>
            </html>
            """,
            is_html=True
        )
        
        if not email_sent:
            return jsonify({"msg": "Failed to send verification email"}), 500
            
        return jsonify({"msg": "Verification email sent"}), 200

@authbp.route("/verify-email", methods=["POST"])
def verify_email():
    data = request.get_json() or request.form
    email = data.get("email")
    otp_code = data.get("otp_code")
    
    if not email or not otp_code:
        return jsonify({"msg": "Email and OTP code are required"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    if user.is_verified:
        return jsonify({"msg": "User already verified"}), 400
    
    otp_entry = OTP.query.filter_by(user_id=user.id, otp_code=otp_code).first()
    if not otp_entry or otp_entry.expires_at < datetime.now():
        return jsonify({"msg": "Invalid or expired OTP code"}), 400
    
    user.is_verified = True
    db.session.delete(otp_entry)  # Remove the OTP entry after successful verification
    db.session.commit()
    
    return jsonify({"msg": "Email verified successfully", "user": user.to_dict()}), 200