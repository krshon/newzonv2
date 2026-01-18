// script.js

const summarizeBtn = document.getElementById("summarizeBtn");
const inputText = document.getElementById("inputText");
const output = document.getElementById("output");

summarizeBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  if (!text) {
    output.innerText = "Please enter some text to summarize.";
    output.classList.add("show");
    return;
  }

  output.innerText = "Summarizing...";
  output.classList.add("show");

  try {
    const response = await fetch("http://localhost:5000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    if (data.summary) {
      const inputWords = text.split(/\s+/).length;
      const outputWords = data.summary.split(/\s+/).length;
      const reduction = ((1 - outputWords / inputWords) * 100).toFixed(1);

      output.innerHTML = `
        <strong>Summary:</strong><br>
        ${data.summary}<br><br>
        <small>📝 Input: ${inputWords} words → Summary: ${outputWords} words 
        (${reduction}% shorter)</small>
      `;
    } else {
      output.innerText = "Could not generate summary.";
    }

    output.classList.remove("show");   // reset for fade-in
    void output.offsetWidth;           // trigger reflow
    output.classList.add("show");      // fade-in effect
  } catch (err) {
    console.error(err);
    output.innerText = "Error connecting to backend.";
    output.classList.add("show");
  }
});
