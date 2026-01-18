// article.js
const summarizeBtn = document.getElementById("summarizeBtn");
const summaryOutput = document.getElementById("summaryOutput");
const articleContent = document.querySelector(".full-news-article");

summarizeBtn.addEventListener("click", async () => {
    summaryOutput.innerHTML = `<p class="loading">🧠 Summarizing article... ⏳</p>`;

    const paragraphs = Array.from(
        articleContent.querySelectorAll(
            "p:not(.bias-percentage):not(.truth-percentage):not(.article-date)"
        )
    );
    const text = paragraphs.map(p => p.innerText).join(" ");

    try {
        let summary = await summarizeArticle(text);

        // Remove leading/trailing junk or duplicated intro
        summary = summary.replace(/^.*Summarizing article.*?⏳/i, "").trim();

        // Optional: limit to ~4 sentences
        const sentences = summary.split(/(?<=[.?!])\s+/).slice(0, 4).join(" ");

        summaryOutput.innerHTML = `<p class="fade-in"><strong>🧠 Summary:</strong> ${sentences}</p>`;
    } catch (err) {
        summaryOutput.innerHTML = `<p class="fade-in error">❌ Cannot connect to summarizer backend.</p>`;
        console.error(err);
    }
});

async function summarizeArticle(text) {
    const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    return data.summary || "No summary available.";
}
