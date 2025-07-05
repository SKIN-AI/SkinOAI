# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
import io
from model import predict
from TextModel import TextModel

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'API is running!'

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'})

# Instantiate Gemini-based TextModel
TEXT_MODEL = TextModel()

@app.route('/predict', methods=['POST'])
def predict_route():
    try:
        data = request.json

        # Decode the image from base64
        img_data = base64.b64decode(data['image'])
        image = Image.open(io.BytesIO(img_data)).convert("RGB")

        # Get the symptom text
        text_info = data.get('text', '')

        # Run image model
        disease_pred, confidence = predict(image)

        # Call Gemini for recommendation
        recommendation = TEXT_MODEL.generate_text(disease_pred, text_info)

        return jsonify({
            'predicted_class': disease_pred,
            'confidence': confidence,
            'recommendation': recommendation
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
