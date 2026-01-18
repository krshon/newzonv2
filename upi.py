from transformers import AutoModelForSequenceClassification, AutoTokenizer

MODEL_DIR = "bias_model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)

print("✅ Model loaded successfully!")
from transformers import AutoModelForSequenceClassification, AutoTokenizer

MODEL_DIR = "bias_model"

model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)

# 🔴 Replace "YOUR_USERNAME" with your actual Hugging Face username
model.push_to_hub("krishna1705/newzon-political-bias")
tokenizer.push_to_hub("krishna1705/newzon-political-bias")

print("🚀 Model successfully uploaded to Hugging Face!")
