from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from GoogleNews import GoogleNews
from fastapi.middleware.cors import CORSMiddleware
import torch
import re

# -------------------------------
# APP INIT
# -------------------------------
app = FastAPI(title="NEWZON Truth Index API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# MODEL LOAD
# -------------------------------
MODEL_NAME = "jy46604790/Fake-News-Bert-Detect"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()

# -------------------------------
# INPUT SCHEMA
# -------------------------------
class TextItem(BaseModel):
    text: str

# -------------------------------
# UTILS
# -------------------------------
def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    return text.strip()

def build_query(text: str) -> str:
    """
    Use first 8 meaningful words as Google News query
    """
    words = clean_text(text).split()
    return " ".join(words[:8])

def check_google_news(query: str):
    try:
        googlenews = GoogleNews(lang="en", region="IN")
        googlenews.search(query)
        results = googlenews.result()

        if not results:
            return {"source_count": 0, "sources": []}

        sources = []
        for r in results:
            media = r.get("media")
            if media and media not in sources:
                sources.append(media)

        return {
            "source_count": len(sources),
            "sources": sources[:5]
        }

    except Exception:
        return {"source_count": 0, "sources": []}

def source_boost(source_count: int) -> int:
    """
    Bounded, explainable boost
    """
    if source_count == 0:
        return 0
    elif source_count == 1:
        return 10
    elif source_count <= 3:
        return 20
    else:
        return 30

# -------------------------------
# PREDICT ENDPOINT
# -------------------------------
@app.post("/predict")
def predict(item: TextItem):

    # -------- AI MODEL --------
    inputs = tokenizer(
        item.text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256
    )

    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=1)[0].tolist()

    fake_prob = round(probs[0] * 100, 2)
    real_prob = round(probs[1] * 100, 2)

    # -------- SOURCE CHECK --------
    query = build_query(item.text)
    source_data = check_google_news(query)
    source_count = source_data["source_count"]

    # -------- FINAL TRUTH SCORE --------
    boost = source_boost(source_count)
    final_truth = min(100, round(real_prob + boost, 2))

    # -------- LABEL LOGIC --------
    if source_count >= 2 and final_truth >= 70:
        final_label = "VERIFIED_BY_SOURCES"
    elif final_truth < 40:
        final_label = "LIKELY_FAKE"
    else:
        final_label = "UNVERIFIED"

    # -------- RESPONSE --------
    return {
        "truth_percent": final_truth,
        "ai_real_probability": real_prob,
        "ai_fake_probability": fake_prob,

        "source_count": source_count,
        "sources": source_data["sources"],

        "final_label": final_label,
        "status": "LIVE",
        "note": "Credibility score may update as more sources emerge"
    }
