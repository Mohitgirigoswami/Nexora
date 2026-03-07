from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt
import uuid
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    uuid = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    
    tasks = db.relationship('Task', backref='user', lazy=True)
    goals = db.relationship('Goal', backref='user', lazy=True)

    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def to_dict(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat()
        }

class Goal(db.Model):
    __tablename__ = 'goals'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    uuid = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))

    tasks = db.relationship('Task', backref='goal', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "tasks": [task.to_dict() for task in self.tasks]
        }

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.Date, nullable=True) # Stores standard YYYY-MM-DD
    duration_minutes = db.Column(db.Integer, nullable=True)
    color = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), default='pending') # e.g., 'done', 'pending'
    active = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey('goals.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    uuid = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))

    def to_dict(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "title": self.title,
            "description": self.description,
            "date": self.date.isoformat() if self.date else None,
            "duration_minutes": self.duration_minutes,
            "color": self.color,
            "status": self.status,
            "active": self.active,
            "user_id": self.user_id,
            "goal_id": self.goal_id,
            "created_at": self.created_at.isoformat()
        }

class OTP(db.Model):
    __tablename__ = 'otps'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    otp_code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    uuid = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))

    user = db.relationship('User', backref=db.backref('otps', cascade="all, delete-orphan"))

    def is_expired(self):
        return datetime.utcnow() > self.expires_at
