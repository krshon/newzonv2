import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

const HF_API_TOKEN = process.env.HF_API_TOKEN;

if (!HF_API_TOKEN) {
  console.error("❌ Please set HF_API_TOKEN in your .env file!");
  process.exit(1);
}

// Handle preflight OPTIONS
app.options("/summarize", (req, res) => res.sendStatus(200));

// ===================================================================
// ✅ SUMMARIZE ENDPOINT (FULLY FIXED)
// ===================================================================

app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await response.json();

    // ============================================================
    // 🔥 HANDLE ALL HF RESPONSE SHAPES
    // ============================================================

    let summary = null;

    // Normal HF output:
    // [ { summary_text: "..." } ]
    if (Array.isArray(data) && data[0]?.summary_text) {
      summary = data[0].summary_text;
    }

    // Some models return:
    // { generated_text: "..." }
    else if (data.generated_text) {
      summary = data.generated_text;
    }

    // Model still loading:
    // { "error": "Model loading" }
    else if (data.error && data.error.toLowerCase().includes("loading")) {
      return res.status(503).json({
        summary: "",
        error: "Model is warming up — try again in 2–4 seconds.",
      });
    }

    // If we still don't have summary
    if (!summary) {
      console.error("Unexpected HF response:", data);
      return res.status(500).json({
        error: "Summarization failed",
        debug: data,
      });
    }

    // SUCCESS
    return res.json({ summary });
  } catch (err) {
    console.error("❌ Summarizer crashed:", err);
    return res.status(500).json({ error: "Summarization failed" });
  }
});

// ===================================================================
// START SERVER
// ===================================================================

app.listen(5000, () =>
  console.log("🧠 Summarizer backend running on http://localhost:5000")
);
