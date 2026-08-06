import os
import json
import google.generativeai as genai

BASE_SYSTEM_PROMPT = """You are SevaAI, an AI assistant for India's NGO and social welfare ecosystem.

Your responsibilities:
- Help citizens understand government schemes.
- Help NGOs with compliance, proposal writing, CSR funding and project planning.
- Help government officers with policy explanations.
- Help volunteers with community activities.

Active User Context:
You are currently responding to a user whose platform role is: {role_context}. Tailor the style, detail level, and focus of your response to fit this role's perspective.

Rules:
- Never invent government schemes.
- If unsure, clearly state that you are uncertain.
- Prefer structured answers with headings, bullet points and tables.
- Always respond in the user's selected language.
- Keep answers practical and concise.
- When RAG is available, base answers only on retrieved official documents.
"""

def generate_chat_response(message: str, history: list, role: str, language: str, context: str = None):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    role_name = role.replace("_", " ").title() if role else "Citizen"
    lang_name = "Hindi" if language == "hi" else "English"
    formatted_system = BASE_SYSTEM_PROMPT.format(role_context=role_name)
    
    if context:
        formatted_system += f"\n\nRetrieved Context from official documents:\n{context}\n\nStrict Instruction: You must answer the user's question basing your response ONLY on the provided Retrieved Context. If the context is insufficient or does not contain the answer, you MUST state: 'The requested information could not be found in the knowledge base.' Do not fabricate, assume, or use external knowledge."
        
    language_rule = f"\n- Output Language Constraint: You must respond strictly in {lang_name}."
    full_prompt = formatted_system + language_rule
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=full_prompt
    )
    contents = []
    for h in history:
        role_name_type = "user" if h.get("role") == "user" else "model"
        contents.append({"role": role_name_type, "parts": [h.get("content", "")]})
    contents.append({"role": "user", "parts": [message]})
    response = model.generate_content(contents)
    return response.text

def generate_project_proposal(details: dict, context: str = None):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    context_instruction = ""
    if context:
      context_instruction = f"\n\nRetrieved context from official documents:\n{context}\n\nStrict instruction: Ground the proposal details, guidelines, and schemes ON this retrieved context wherever relevant. Mention matching schemes or policies naturally in the text and cite the source names in the References/Sources section."
    else:
      context_instruction = "\n\nNo relevant official documents were found in the knowledge base. Generate the proposal using general knowledge and clearly state in the References/Sources section that no supporting official documents were found in the knowledge base."

    prompt = f"""Generate a comprehensive, professional project proposal for an Indian NGO.
    {context_instruction}
    
    Project Details:
    - Name: {details.get('project_name')}
    - Location: {details.get('location')}
    - Budget: Rs. {details.get('budget')}
    - Target Group: {details.get('target_group')}
    - Duration: {details.get('duration')}
    - Description: {details.get('description')}
    - Focus Area: {details.get('focus_area')}
    
    In the "proposal_text" field, output the complete proposal in clean Markdown with headings, bullet lists, and tables where appropriate, covering exactly these 14 sections:
    1. Executive Summary
    2. Problem Statement
    3. Project Objectives
    4. Target Beneficiaries
    5. Implementation Plan
    6. Timeline
    7. Budget Breakdown (with a detailed breakdown table)
    8. Expected Outcomes
    9. Monitoring & Evaluation
    10. Sustainability Plan
    11. Risk Assessment
    12. Government Scheme Mapping
    13. SDG Alignment
    14. References / Sources (list source filenames here if context was used; else state 'No matching supporting documents found in knowledge base. General knowledge used.')
    
    Return a JSON object containing the following keys (ensure it is valid JSON and nothing else, no markdown code block formatting or backticks around it):
    {{
        "title": "Project Name",
        "proposal_text": "Full markdown text of the proposal containing all 14 detailed sections",
        "executive_summary": "Concise summary section text",
        "objectives": ["SMART goal 1", "SMART goal 2", "SMART goal 3"],
        "timeline": "Implementation timeline text",
        "budget_breakdown": "Budget breakdown text",
        "expected_impact": "Expected outcomes & impact metrics text",
        "monitoring_strategy": "Monitoring & evaluation strategy text"
    }}
    """
    response = model.generate_content(prompt)
    raw_text = response.text.strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text.split("```json", 1)[1]
    if raw_text.endswith("```"):
        raw_text = raw_text.rsplit("```", 1)[0]
    raw_text = raw_text.strip()
    try:
        return json.loads(raw_text)
    except Exception:
        return {
            "title": details.get('project_name'),
            "proposal_text": raw_text,
            "executive_summary": "Check full proposal text.",
            "objectives": ["Objective details in full proposal"],
            "timeline": "Timeline details in full proposal",
            "budget_breakdown": "Budget details in full proposal",
            "expected_impact": "Impact details in full proposal",
            "monitoring_strategy": "Monitoring details in full proposal"
        }
