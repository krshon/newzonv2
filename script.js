document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.querySelector("main"); // Optional: if you use <main> tag
    const tweetsSection = document.querySelector(".sidebar");
  
    // Sample news data
    const newsArticles = [
      {
        title: "Breaking: Government Announces New Policy",
        description: "The government has introduced a new policy affecting citizens.",
        bias: "left"
      },
      {
        title: "Economy Report: Market Trends This Year",
        description: "A neutral look at this year's market trends and economic policies.",
        bias: "center"
      },
      {
        title: "Opinion: The Future of Technology",
        description: "Tech innovations and their impact on future jobs.",
        bias: "right"
      }
    ];
  
    // Function to create a news article element
    function createNewsArticle(article) {
      const articleElement = document.createElement("article");
      articleElement.classList.add("news-article");
  
      articleElement.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description}</p>
        <div class="bias-bar" data-bias="${article.bias}"></div>
      `;
  
      return articleElement;
    }
  
    // Render sample articles (optional)
    newsArticles.forEach(article => {
      const articleElement = createNewsArticle(article);
      if (newsContainer) {
        newsContainer.appendChild(articleElement);
      }
    });
  credibilityBox.style.background =
  finalCredibility > 75
    ? "linear-gradient(135deg,#22c55e,#16a34a)"
    : finalCredibility > 50
    ? "linear-gradient(135deg,#facc15,#eab308)"
    : "linear-gradient(135deg,#ef4444,#dc2626)";

    // ===== WEATHERSTACK API (Weather) =====
    const WEATHERSTACK_API_KEY = "5242c8214535cc02f96e09e136025ea";
  
    fetch(`https://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=Jaipur`)
      .then(res => res.json())
      .then(data => {
        const weatherBox = document.createElement("div");
        weatherBox.className = "tweet-box";
        weatherBox.innerHTML = `
          <div class="tweet-header">
            <div class="tweet-info">
              <h3>Weather Update</h3>
              <p>${data.location.name} · Now</p>
            </div>
          </div>
          <p class="tweet-text">🌤 ${data.current.weather_descriptions[0]}, 🌡 ${data.current.temperature}°C</p>
          <div class="tweet-actions">
            <span>💨 ${data.current.wind_speed} km/h</span>
            <span>💧 Humidity: ${data.current.humidity}%</span>
          </div>
        `;
        tweetsSection.prepend(weatherBox);
      })
      .catch(err => console.error("Weatherstack API error:", err));
  
    // ===== FINNHUB API (Stock Updates) =====
     // ===== ALPHA VANTAGE API (Stock Data) =====
  const ALPHA_VANTAGE_API_KEY = "5A61KD5IASTLG6W"; // Replace with your actual Alpha Vantage API key
  const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NFLX", "NVDA", "META"]; // List of stock symbols

  // Fetch stock data for each symbol
  symbols.forEach(symbol => {
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${ALPHA_VANTAGE_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data && data["Time Series (1min)"]) {
          const latestData = data["Time Series (1min)"];
          const latestTime = Object.keys(latestData)[0];
          const latestInfo = latestData[latestTime];

          const stockBox = document.createElement("div");
          stockBox.className = "tweet-box";
          stockBox.innerHTML = `
            <div class="tweet-header">
              <div class="tweet-info">
                <h3>Stock Update</h3>
                <p>${symbol} · ${latestTime}</p>
              </div>
            </div>
            <p class="tweet-text">💹 ${symbol}: $${latestInfo["4. close"]} (${((latestInfo["4. close"] - latestInfo["1. open"]) / latestInfo["1. open"] * 100).toFixed(2)}%)</p>
            <div class="tweet-actions">
              <span>📈 Open: $${latestInfo["1. open"]}</span>
              <span>📉 Low: $${latestInfo["3. low"]}</span>
              <span>📊 High: $${latestInfo["2. high"]}</span>
            </div>
          `;
          tweetsSection.prepend(stockBox);
        } else {
          console.warn(`No data available for ${symbol}`, data);
        }
      })
      .catch(err => console.error("Alpha Vantage API error:", err));
  });
});
