from flask import Flask, request, jsonify, render_template
from pyngrok import ngrok
import requests
from io import BytesIO
import os

from cancer_config import MODEL_PATHS, PREPROCESS_FUNCS
from model_runner import run_model
from file_handler import detect_file_type, preprocess_by_file_type

app = Flask(__name__)

@app.route("/")
def home():
    """Render the main template"""
    return render_template('index.html')

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    image_url = data.get("image_url")
    cancer_type = data.get("cancer_type")

    if not image_url:
        return jsonify({"error": "Image URL is required"}), 400

    if cancer_type not in MODEL_PATHS:
        return jsonify({"error": "Invalid cancer type"}), 400

    try:
        # Step 1: Download file from URL
        response = requests.get(image_url)
        response.raise_for_status()
        file_content = response.content

        # Step 2: Detect file type
        file_type = detect_file_type(file_content)
        print(f"Detected file type: {file_type}")

        # Step 3: Preprocess based on file type (convert to PIL Image)
        pil_image = preprocess_by_file_type(file_content, file_type)

        # Step 4: Cancer-specific preprocessing
        preprocess_func = PREPROCESS_FUNCS[cancer_type]
        processed_img = preprocess_func(pil_image)
        
        # Step 5: Run model
        model_path = MODEL_PATHS[cancer_type]
        result = run_model(model_path, processed_img)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    public_url = ngrok.connect(5000)
    print(" * ngrok tunnel running at:", public_url)
    app.run(port=5000)