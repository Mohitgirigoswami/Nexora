from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from model import db, User, Task, Goal
from datetime import datetime

main_bp = Blueprint("Main", __name__)

@main_bp.route("/add_goal", methods=["POST"])
@jwt_required()
def add_goal():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    title = data.get("title")
    description = data.get("description", "")
    tasks_data = data.get("tasks", []) # List of task objects
    
    if not title:
        return jsonify({"error": "Title is required"}), 400
        
    try:
        new_goal = Goal(
            title=title,
            description=description,
            user_id=user_id,
            status=data.get("status", "pending")
        )
        db.session.add(new_goal)
        db.session.flush() 
        
        created_tasks = []
        for t in tasks_data:
            task_date = None
            if t.get("date"):
                try:
                    task_date = datetime.strptime(t["date"], "%Y-%m-%d").date()
                except ValueError:
                    pass

            task = Task(
                title=t.get("title"),
                description=t.get("description", ""),
                date=task_date,
                duration_minutes=t.get("duration_minutes", 0),
                color=t.get("color", "#06b6d4"),
                status=t.get("status", "pending"),
                active=t.get("active", True),
                user_id=user_id,
                goal_id=new_goal.id
            )
            db.session.add(task)
            created_tasks.append(task)
            
        db.session.commit()
        return jsonify({
            "msg": "Goal and tasks added successfully", 
            "goal": new_goal.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@main_bp.route("/add_task", methods=["POST"])
@jwt_required()
def add_task():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    title = data.get("title")
    if not title:
        return jsonify({"error": "Title is required"}), 400
        
    task_date = None
    if data.get("date"):
        try:
            task_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    new_task = Task(
        title=title,
        description=data.get("description", ""),
        date=task_date,
        duration_minutes=data.get("duration_minutes", 0),
        color=data.get("color", "#06b6d4"),
        status=data.get("status", "pending"),
        active=data.get("active", True),
        user_id=user_id,
        goal_id=data.get("goal_id") 
    )
    
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify({"msg": "Task added successfully", "task": new_task.to_dict()}), 201

@main_bp.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify({"tasks": [task.to_dict() for task in tasks]}), 200

@main_bp.route("/goals", methods=["GET"])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    goals = Goal.query.filter_by(user_id=user_id).all()
    return jsonify({"goals": [goal.to_dict() for goal in goals]}), 200

@main_bp.route("/goal/<int:goal_id>", methods=["GET"])
@jwt_required()
def get_goal(goal_id):
    user_id = get_jwt_identity()
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found or unauthorized access"}), 404
    return jsonify({"goal": goal.to_dict()}), 200

@main_bp.route("/task/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"error": "Task not found or unauthorized access"}), 404
    return jsonify({"task": task.to_dict()}), 200

@main_bp.route("/update_task/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"error": "Task not found or unauthorized access"}), 404
        
    data = request.get_json()
    
    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    
    if data.get("date"):
        try:
            task.date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
            
    task.duration_minutes = data.get("duration_minutes", task.duration_minutes)
    task.color = data.get("color", task.color)
    task.status = data.get("status", task.status)
    task.active = data.get("active", task.active)
    
    db.session.commit()
    
    return jsonify({"msg": "Task updated successfully", "task": task.to_dict()}), 200

@main_bp.route("/update_goal/<int:goal_id>", methods=["PUT"])
@jwt_required()
def update_goal(goal_id):
    user_id = get_jwt_identity()
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found or unauthorized access"}), 404
        
    data = request.get_json()
    
    goal.title = data.get("title", goal.title)
    goal.description = data.get("description", goal.description)
    goal.status = data.get("status", goal.status)
    
    db.session.commit()
    
    return jsonify({"msg": "Goal updated successfully", "goal": goal.to_dict()}), 200