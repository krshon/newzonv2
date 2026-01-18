from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ---------------------------
# Initialize pipelines
# ---------------------------

# Zero-shot classification for political leaning
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli", 
    framework="pt"  # Force PyTorch
)
LABELS = [
    "left-wing political ideology",
    "centrist moderate political ideology",
    "right-wing conservative political ideology"
]


# Summarization pipeline (FORCE PYTORCH + STABLE MODEL)
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    framework="pt"  # Prevent TensorFlow fallback
)

# ---------------------------
# Routes
# ---------------------------

@app.route("/predict", methods=["POST"])
def predict():
    """
    Predict political leaning of the text.
    Expected JSON input: { "text": "..." }
    """
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Text is required"}), 400

    text = data["text"]
    if not text.strip():
        return jsonify({"result": {label: 0 for label in LABELS}})

    try:
        result = classifier(text, candidate_labels=LABELS)
        bias_scores = {
            label: round(score * 100, 2)
            for label, score in zip(result["labels"], result["scores"])
        }
        return jsonify({"result": bias_scores})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/summarize", methods=["POST"])
def summarize():
    """
    Summarize the given text.
    Expected JSON input: { "text": "..." }
    """
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Text is required"}), 400

    text = data["text"]
    if not text.strip():
        return jsonify({"summary": ""})

    try:
        summary = summarizer(
            text,
            max_length=120,
            min_length=40,
            do_sample=False,
        )
        return jsonify({"summary": summary[0]["summary_text"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------
# Run server
# ---------------------------

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
