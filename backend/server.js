const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

const apiKey = "5a520f6945b6453aa59f058782638025";

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// News route
app.get("/news", async (req, res) => {
  try {
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&pageSize=5&apiKey=${apiKey}`;
    console.log("Fetching:", url);

    const response = await fetch(url);
    console.log("NewsAPI status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NewsAPI error:", errorText);
      return res.status(500).json({ error: `NewsAPI error: ${response.status}`, details: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
