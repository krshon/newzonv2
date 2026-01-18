# server.py
import os
os.environ["TRANSFORMERS_NO_TF"] = "1"

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import shutil
from pathlib import Path
from transcribe_and_label import process_video
from fastapi.middleware.cors import CORSMiddleware

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all sources (file:// included)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload reel → classify political leaning."""
    video_path = UPLOAD_DIR / file.filename

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = process_video(str(video_path))
    print("SERVER RESULT:", result)
    # FIX: Wrap result in content= so JSON is valid
    return JSONResponse(content=result)

@app.get("/")
def home():
    return {"message": "NEWZON Reel AI API is running!"}