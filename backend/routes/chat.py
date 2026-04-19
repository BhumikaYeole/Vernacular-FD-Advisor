from flask import Blueprint, request, jsonify
from services.ai_service import generate_response
from services.translate_service import translate_text

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    
    try:
        data = request.json
        message = data.get("message")
        lang = data.get("lang", "en")

        print("Incoming:", message)
        

        translated_input = translate_text(message, "en")
        ai_response = generate_response(translated_input)
        final_response = translate_text(ai_response, lang)

        return jsonify({"response": final_response})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500