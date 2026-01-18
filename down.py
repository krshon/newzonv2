from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os
MODEL_NAME = "cardiffnlp/twitter-roberta-base-politics"

SAVE_DIR = "political_leaning_model"  # folder where model will be saved

# Create folder if it doesn't exist
os.makedirs(SAVE_DIR, exist_ok=True)

# Download and save tokenizer
print("Downloading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
tokenizer.save_pretrained(SAVE_DIR)

# Download and save model
print("Downloading model...")
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.save_pretrained(SAVE_DIR)

print(f"Model and tokenizer saved to '{SAVE_DIR}'")