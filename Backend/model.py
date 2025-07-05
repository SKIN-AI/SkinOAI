import torch
from torchvision import transforms, models
from PIL import Image
import torch.nn.functional as F
import requests

# Load environment variables
GEMINI_API_KEY = "AIzaSyB1KoEMCjMqaRfIwEQyFQWFBwyo5uQUK3Q"

# Define the image transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load the trained model
model_path = 'C:/Users/satad/Desktop/Project/SkinOAI/Skin-o-Backend/modelFile.pth'

# List of diseases
list_diseases = [
    "Actinic Keratosis", "Basal Cell Carcinoma", "Dermato Fibroma", "Melanoma", "Nevus",
    "Pigmented Benign Keratosis", "Seborrheic Keratosis", "Squamous Cell Carcinoma", "Vascular Lesion",
    "Eczema", "Atopic Dermatitis", "Psoriasis", "Tinea Ringworm Candidiasis",
    "Warts Molluscum", "Acne/Pimples"
]

# Load the image classification model
num_classes = len(list_diseases)
image_model = models.efficientnet_b0(weights=None)
num_features = image_model.classifier[1].in_features
image_model.classifier[1] = torch.nn.Linear(num_features, num_classes)
image_model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
image_model.eval()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
image_model.to(device)

def predict(image, model=image_model, transform=transform, device=device):
    image = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(image)
        probabilities = F.softmax(output, dim=1)
        confidence, predicted = torch.max(probabilities, 1)
        predicted_class = list_diseases[predicted.item()]
        confidence = "{:.2f}".format(confidence.item() * 100)
        return predicted_class, confidence

# Gemini API Call
def generate_gemini_recommendation(disease, symptoms_text):
    endpoint = "https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"I have the disease {disease}. The symptoms I experience are: {symptoms_text}. "
                                f"Give me some medical suggestions or treatment advice in a short paragraph."
                    }
                ]
            }
        ]
    }

    response = requests.post(
        f"{endpoint}?key={GEMINI_API_KEY}",
        headers=headers,
        json=payload
    )

    if response.status_code == 200:
        try:
            return response.json()['candidates'][0]['content']['parts'][0]['text']
        except (KeyError, IndexError):
            return "Gemini API returned unexpected response format."
    else:
        return f"Gemini API error: {response.status_code} - {response.text}"

# Full pipeline: image + text
def img_txt_pipe(image_path, symptoms_text):
    image = Image.open(image_path).convert('RGB')
    disease_pred, confidence = predict(image)
    recommendation = generate_gemini_recommendation(disease_pred, symptoms_text)
    return {
        "disease": disease_pred,
        "confidence": confidence,
        "recommendation": recommendation
    }

# Example call:
# text_info = "Scaly red patches on face and arms after long sun exposure."
# result = img_txt_pipe('./test-data/image_46.jpg', text_info)
# print(result)
