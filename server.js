// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import dotenv from "dotenv";
import connectDB from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (CSS, JS, images, auth pages)
app.use(express.static(__dirname));

// Entry (Firebase will guard inside index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// -------- APIs --------

// News
const API_KEY = process.env.NEWS_API_KEY || "NEWS_API_KEY";
const BASE_URL = "https://newsapi.org/v2";

app.get("/api/news", async (req, res) => {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// Bias
app.post("/api/bias", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const response = await fetch("http://127.0.0.1:5001/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await response.json();
  res.json(data);
});

// Summarize
app.post("/api/summarize", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const py = spawn("python", ["summarize.py"]);
  let output = "";

  py.stdout.on("data", d => output += d.toString());
  py.on("close", () => {
    res.json(JSON.parse(output));
  });

  py.stdin.write(JSON.stringify({ text }));
  py.stdin.end();
});

// Start
app.listen(PORT, () => {
  console.log(`✅ NEWZON running at http://localhost:${PORT}`);
});
