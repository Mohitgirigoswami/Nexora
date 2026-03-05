def get_task_generation_prompt(user_input_goal, current_date="2026-03-06"):
    return f"""
You are an expert productivity agent and goal decomposer. 
The user wants to achieve the following goal: "{user_input_goal}"

Your job is to break this goal down into a logical sequence of actionable, daily tasks. 

You MUST return the output STRICTLY as a raw JSON array of objects. Do not include any conversational text, explanations, or markdown code blocks (do NOT use ```json).

Each JSON object in the array must perfectly adhere to the following schema:
[
  {{
    "title": "String (Max 200 chars. A clear, actionable step)",
    "description": "String (Brief details on how to accomplish the task)",
    "duration_minutes": "Integer (Estimated time to complete in minutes. E.g., 120 for 2 hours)",
    "date": "String (Must be strictly ISO 8601 format 'YYYY-MM-DD'. Assume today is {current_date} and schedule forward)",
    "is_ai": true,
    "color": "String (Provide a standard hex color code suitable for a dark mode UI, e.g., #06b6d4)",
    "status": "pending",
    "active": true
  }}
]
"""
