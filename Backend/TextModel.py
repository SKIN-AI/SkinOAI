# backend/TextModel.py
import os
import requests
from dotenv import load_dotenv

# Load Gemini API key from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class TextModel:
    def __init__(self):
        # No local model/tokenizer needed for Gemini
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        self.api_key = "AIzaSyB2blnd4UR8SZszHcZYnoQXbjINEPX0Qec"

    def generate_text(self, disease_pred, desc):
        # Construct the prompt
        prompt = (
            f"You are a medical chatbot who suggests treatment plan for skin diseases.\n\n"
            f"Symptoms: {desc}\n"
            f"Diagnosis: The disease is most likely {disease_pred}.\n\n"
            f"Give the output in this format:\n\n"
            f"Treatment Plan:\n"
            f"1) ...\n"
            f"2) ...\n"
            f"(Maximum 5)\n\n"
            f"Disclaimer: Consult with a dermatologist or skincare expert for more detailed recommendations.\n"
        )

        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }

        response = requests.post(
            f"{self.api_url}?key={self.api_key}",
            headers=headers,
            json=payload
        )

        if response.status_code == 200:
            try:
                return response.json()['candidates'][0]['content']['parts'][0]['text']
            except (KeyError, IndexError):
                return "Gemini API returned an unexpected response format."
        else:
            return f"Gemini API error: {response.status_code} - {response.text}"
