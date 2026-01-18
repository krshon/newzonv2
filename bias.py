from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)
CORS(app)   # ✅ ENABLE CORS

# Load from LOCAL directory (already downloaded)
MODEL_NAME = "./bias_model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()

LABELS = ["Left", "Center", "Right"]

@app.route('/api/analyze', methods=['POST'])
def analyze_article():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=1)[0].tolist()

    bias_scores = {
        LABELS[i]: round(probs[i] * 100, 2)
        for i in range(len(LABELS))
    }

    return jsonify({"bias": bias_scores})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
