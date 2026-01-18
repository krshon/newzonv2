# transcribe_and_label.py
import os
os.environ["TRANSFORMERS_NO_TF"] = "1"

import re
import json
from pathlib import Path

import whisper
import torch
import soundfile as sf
from transformers import pipeline
from moviepy import VideoFileClip


# -----------------------
# FOLDERS
# -----------------------
SRT_DIR = Path("srt")
SRT_DIR.mkdir(exist_ok=True)

LABELS = ["Left Wing", "Right Wing", "Center"]


# -----------------------
# LOAD MODELS
# -----------------------
print("Loading Whisper model...")
whisper_model = whisper.load_model("base")

print("Loading BART MNLI classifier...")
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",
    device=0 if torch.cuda.is_available() else -1
)


# -----------------------
# AUDIO EXTRACTION (NO FFMPEG)
# -----------------------
def extract_audio(video_path):
    """Extract audio using MoviePy ONLY (no ffmpeg)."""
    audio_path = str(SRT_DIR / (Path(video_path).stem + ".wav"))

    print("Extracting audio using MoviePy...")
    clip = VideoFileClip(video_path)
    clip.audio.write_audiofile(
        audio_path,
        fps=16000,
        codec="pcm_s16le"   # wav, raw PCM, whisper-compatible
    )
    clip.close()

    print("Audio saved at:", audio_path)
    return audio_path


# -----------------------
# TRANSCRIBE → SRT
# -----------------------
def transcribe_to_srt(video_path):
    print("\n--- START TRANSCRIPTION ---\n")

    # Extract audio wav
    audio_path = extract_audio(video_path)

    # Load wav WITHOUT ffmpeg
    print("Loading WAV using soundfile...")
    audio_array, sr = sf.read(audio_path)

    # stereo → mono
    if audio_array.ndim > 1:
        audio_array = audio_array.mean(axis=1)

    # FIX: Whisper expects float32
    audio_array = audio_array.astype("float32")

    print("Running Whisper...")
    result = whisper_model.transcribe(
        audio_array,
        language="en",
        verbose=False,
        fp16=False
    )

    # Create SRT
    srt_path = SRT_DIR / (Path(video_path).stem + ".srt")

    with open(srt_path, "w", encoding="utf-8") as f:
        for i, seg in enumerate(result["segments"], start=1):
            f.write(
                f"{i}\n"
                f"{format_time(seg['start'])} --> {format_time(seg['end'])}\n"
                f"{seg['text'].strip()}\n\n"
            )

    print("SRT saved at:", srt_path)
    return srt_path, result["segments"]


# -----------------------
# HELPERS
# -----------------------
def format_time(seconds):
    ms = int((seconds - int(seconds)) * 1000)
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def extract_text(segments):
    text = " ".join([seg["text"].strip() for seg in segments])
    return re.sub(r"\s+", " ", text)


def classify_text(text):
    result = classifier(text, candidate_labels=LABELS)
    return result["labels"][0], result["scores"]


# -----------------------
# FULL PIPELINE
# -----------------------
def process_video(video_path):
    print("\n===================================")
    print("PROCESSING:", video_path)
    print("===================================\n")

    srt_path, segments = transcribe_to_srt(video_path)
    text = extract_text(segments)
    label, scores = classify_text(text)

    output = {
        "video": video_path,
        "srt": str(srt_path),
        "text": text,
        "label": label,
        "scores": [float(s) for s in scores],
    }

    with open("last_result.json", "w") as f:
        json.dump(output, f, indent=4)

    return output


# -----------------------
# CLI SUPPORT
# -----------------------
if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python transcribe_and_label.py <video.mp4>")
        exit()

    result = process_video(sys.argv[1])
    print(json.dumps(result, indent=4))
