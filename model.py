import sys
import json
from transformers import pipeline

# Zero-shot classification pipeline
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",  # available on Hugging Face
    device=-1  # change to 0 if you have GPU
)

CANDIDATE_LABELS = ["Left", "Center", "Right"]

# Read JSON from stdin
input_json = sys.stdin.read()
data = json.loads(input_json)
text = data.get("text", "")

if text:
    results = classifier(text, candidate_labels=CANDIDATE_LABELS, multi_label=False)
    # Convert scores to percentages
    bias_scores = {label: round(score*100, 2) for label, score in zip(results["labels"], results["scores"])}
    print(json.dumps(bias_scores))  # Output JSON for server
else:
    print(json.dumps({"Left":0, "Center":0, "Right":0}))
