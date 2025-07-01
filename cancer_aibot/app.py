from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import re

# Import your chatbot and Gemini fallback
from chatbot import MedicalChatBot
from gemini_config import generate_medical_response

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app, origins=["http://localhost:3000"])

# Initialize chatbot
try:
    chatbot = MedicalChatBot()
except Exception as e:
    print(f" Failed to initialize chatbot: {e}")
    chatbot = None

# Input validation
def validate_input(text: str) -> tuple[bool, str]:
    if not text or not text.strip():
        return False, "Message cannot be empty"
    if len(text.strip()) < 3:
        return False, "Message too short"
    if len(text) > 1000:
        return False, "Message too long"
    return True, ""

# Sanitize input
def sanitize_input(text: str) -> str:
    text = re.sub(r'<[^>]+>', '', text)
    return re.sub(r'\s+', ' ', text).strip()

@app.route('/')
def home():
    return render_template('index.html')  # Your index.html must be in 'templates/' folder

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json(force=True)
        print("DEBUG: Received data:", data)

        user_input = data.get("message", "").strip()
        language = data.get("language", "en")  # Add this line
        print("DEBUG: User input =", user_input)
        print("DEBUG: Language =", language)  # Add this line

        valid, err = validate_input(user_input)
        if not valid:
            return jsonify({"error": err}), 400

        user_input = sanitize_input(user_input)

        if not chatbot or not chatbot.is_medical_question(user_input):
            # Customize response based on language
            if language == "hi":
                response_text = "मैं कैंसर संबंधी चिकित्सा प्रश्नों में विशेषज्ञ हूं। कृपया एक चिकित्सा विषय के बारे में पूछें।"
            else:
                response_text = "I'm specialized in cancer-related medical questions. Please ask about a medical topic."
            
            return jsonify({
                "response": response_text,
                "is_medical": False,
                "language": language  # Include language in response
            })

        kb_response = chatbot.get_kb_response(user_input)

        if kb_response:
            return jsonify({
                "response": kb_response['answer'],
                "source": kb_response['source'],
                "language": language,  # Add this
                "is_medical": True     # Add this
            })
        else:
            # Pass language to Gemini for localized responses
            context = f"You are a cancer-specialized AI medical assistant. Respond in {'Hindi' if language == 'hi' else 'English'}."
            gemini_answer = generate_medical_response(
                prompt=user_input,
                context=context
            )
            return jsonify({
                "response": gemini_answer,
                "source": "gemini",
                "language": language,  # Add this
                "is_medical": True     # Add this
            })

    except Exception as e:
        print("Error in /chat route:", str(e))
        return jsonify({
            "error": "An internal error occurred.",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f" Running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
