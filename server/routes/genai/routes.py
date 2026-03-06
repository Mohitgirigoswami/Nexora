from flask import Blueprint, request, jsonify
from google import genai
import os
import json
from routes.genai.prompts import get_task_generation_prompt
from datetime import datetime

genai_bp = Blueprint("GenAI", __name__)

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

@genai_bp.route("/generate-tasks", methods=["POST"])
def generate_tasks():
    data = request.get_json()
    query = data.get("query")
    
    if not query:
        return jsonify({"error": "Query is required"}), 400
        
    current_date = datetime.now().strftime("%Y-%m-%d")
    prompt = get_task_generation_prompt(query, current_date)
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        tasks = json.loads(response_text)
        return jsonify({"tasks": tasks}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
