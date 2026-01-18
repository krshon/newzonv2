import os
os.environ["TRANSFORMERS_NO_TF"] = "1"

import os
import re
from pathlib import Path
import whisper
import json
import torch
import numpy as np
from transformers import pipeline

# Folders
SRT_DIR = Path("srt")
SRT_DIR.mkdir(exist_ok=True)

# Political labels
LABELS = ["Left Wing", "Right Wing", "Center"]

# Load Whisper for SRT
print("Loading Whisper model...")
whisper_model = whisper.load_model("base")

# Load Facebook BART MNLI (Zero-Shot)
print("Downloading Facebook BART MNLI...")
classifier = pipeline("zero-shot-classification", 
                      model="facebook/bart-large-mnli",
                      device=0 if torch.cuda.is_available() else -1)

def transcribe_to_srt(video_path):
    """Transcribe and save SRT file."""
    result = whisper_model.transcribe(video_path, verbose=False)

    srt_path = SRT_DIR / (Path(video_path).stem + ".srt")

    with open(srt_path, "w", encoding="utf-8") as f:
        for i, seg in enumerate(result["segments"], start=1):
            start = format_time(seg["start"])
            end = format_time(seg["end"])
            text = seg["text"].strip()

            f.write(f"{i}\n{start} --> {end}\n{text}\n\n")

    print("SRT saved to:", srt_path)
    return srt_path, result["segments"]


def format_time(seconds):
    ms = int((seconds - int(seconds)) * 1000)
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def extract_text(segments):
    """Combine all segment text into clean text."""
    text = " ".join([seg["text"].strip() for seg in segments])
    return re.sub(r"\s+", " ", text)


def classify_text(text):
    """Zero-shot classify political leaning."""
    result = classifier(text, candidate_labels=LABELS)
    return result["labels"][0], result["scores"]


def process_video(video_path):
    """Full pipeline: video → SRT → text → label."""
    srt_path, segments = transcribe_to_srt(video_path)
    text = extract_text(segments)
    label, scores = classify_text(text)

    output = {
    "video": video_path,
    "srt": str(srt_path),
    "text": text,
    "label": label,
    "scores": [float(s) for s in scores]   # 100% JSON-safe
    }


    with open("last_result.json", "w") as f:
        json.dump(output, f, indent=4)

    return output


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python transcribe_and_label.py <video.mp4>")
        exit()

    video_path = sys.argv[1]
    result = process_video(video_path)
    print(json.dumps(result, indent=4))