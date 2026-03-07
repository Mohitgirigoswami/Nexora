from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from google import genai
import os
import json
from routes.genai.prompts import get_task_generation_prompt, get_refinement_prompt
from datetime import datetime

genai_bp = Blueprint("GenAI", __name__)

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

@genai_bp.route("/generate-tasks", methods=["POST"])
@jwt_required()
def generate_tasks():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    current_date = datetime.now().strftime("%Y-%m-%d")
    prompt = get_task_generation_prompt(query, current_date)

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )
        response_text = response.text.strip()

        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        tasks = json.loads(response_text)
        return jsonify({"tasks": tasks}), 200

    except Exception as e:
        print(f"Error in generate_tasks: {str(e)}")
        return jsonify({"error": str(e)}), 500

@genai_bp.route("/refine-tasks", methods=["POST"])
@jwt_required()
def refine_tasks():
    data = request.get_json()
    current_tasks = data.get("tasks")
    user_instruction = data.get("instruction")

    if not current_tasks or not user_instruction:
        return jsonify({"error": "Tasks and instruction are required"}), 400

    current_date = datetime.now().strftime("%Y-%m-%d")
    prompt = get_refinement_prompt(current_tasks, user_instruction, current_date)

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )
        response_text = response.text.strip()

        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        refined_tasks = json.loads(response_text)
        return jsonify({"tasks": refined_tasks}), 200

    except Exception as e:
        print(f"Error in refine_tasks: {str(e)}")
        return jsonify({"error": str(e)}), 500

