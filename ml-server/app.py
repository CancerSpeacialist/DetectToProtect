from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from PIL import Image
import io
import random
import time

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_url = data.get('image_url')
        cancer_type = data.get('cancer_type', 'unknown')
        
        if not image_url:
            return jsonify({'error': 'No image URL provided'}), 400
        
        # Download image from URL
        response = requests.get(image_url)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to download image'}), 400
        
        # Open image
        image = Image.open(io.BytesIO(response.content))
        
        # Simulate processing time
        time.sleep(2)
        
        # Simple mock prediction (for testing)
        # In real implementation, this would be your trained model
        predictions = ['cat', 'dog']
        confidence_scores = [0.85, 0.92, 0.78, 0.95, 0.67]
        
        prediction = random.choice(predictions)
        confidence = random.choice(confidence_scores)
        
        # Mock additional analysis data
        regions = []
        if prediction == 'cat':
            regions = ['ears', 'whiskers', 'eyes']
        else:
            regions = ['snout', 'ears', 'tail']
        
        result = {
            'prediction': prediction,
            'confidence': confidence,
            'regions': regions,
            'image_dimensions': list(image.size),
            'cancer_type': cancer_type,
            'model_version': '1.0.0-mock'
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model': 'cat-dog-classifier-mock'})

if __name__ == '__main__':
    print("Starting ML Model Server...")
    print("Model: Cat/Dog Classification (Mock)")
    print("Server: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
    
    
# cd ml-server && pip install -r requirements.txt