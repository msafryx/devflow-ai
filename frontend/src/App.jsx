import { useEffect, useState } from "react";
import axios from "axios";

import LayoutShell from "./components/LayoutShell.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import GaugeCard from "./components/GaugeCard.jsx";
import KpiCard from "./components/KpiCard.jsx";
import Panel from "./components/Panel.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";

const FRONTEND_API_KEY = import.meta.env.VITE_FRONTEND_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_CITY = import.meta.env.VITE_OPENWEATHER_CITY || "London";
const OPENWEATHER_COUNTRY = import.meta.env.VITE_OPENWEATHER_COUNTRY || "GB";

function App() {
  const [token, setToken] = useState(localStorage.getItem("devflow_token"));
  const [snapshot, setSnapshot] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(false);

  // --- Handle Google OAuth callback (token in URL) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("devflow_token", urlToken);
      setToken(urlToken);
      // Clean URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // --- Auth handlers ---

  function loginWithGoogle() {
    window.location.href = `${BACKEND_URL}/auth/google`;
  }

  function logout() {
    localStorage.removeItem("devflow_token");
    setToken(null);
    setSnapshot(null);
    setHistory([]);
  }

  // --- Public API fetchers ---

  async function fetchCrypto() {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin,ethereum",
          vs_currencies: "usd",
          include_24hr_change: true,
        },
      }
    );

    const btc = res.data.bitcoin;
    const change = btc.usd_24h_change ?? 0;
    let trend = "Sideways";
    if (change > 3) trend = "Bullish";
    else if (change < -3) trend = "Bearish";

    return {
      btcPrice: btc.usd,
      btcChange24h: change,
      trend,
    };
  }

  async function fetchNews() {
    if (!NEWS_API_KEY) {
      return {
        sentimentScore: 0,
        sentimentLabel: "Neutral",
        topHeadlines: [],
      };
    }

    const res = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "software development OR programming OR AI",
        sortBy: "publishedAt",
        pageSize: 5,
        language: "en",
        apiKey: NEWS_API_KEY,
      },
    });

    const articles = res.data.articles || [];
    const texts = articles.map(
      (a) => (a.title || "") + " " + (a.description || "")
    );

    const positiveWords = ["growth", "success", "up", "surge", "innovation"];
    const negativeWords = ["down", "crash", "fail", "loss", "decline"];

    let score = 0;
    let wordCount = 0;
    texts.forEach((t) => {
      const words = t.toLowerCase().split(/\W+/);
      wordCount += words.length;
      for (const w of words) {
        if (positiveWords.includes(w)) score++;
        if (negativeWords.includes(w)) score--;
      }
    });

    const normalized = wordCount ? score / wordCount : 0;
    let label = "Neutral";
    if (normalized > 0.03) label = "Positive";
    if (normalized < -0.03) label = "Negative";

    return {
      sentimentScore: normalized,
      sentimentLabel: label,
      topHeadlines: articles.map((a) => ({
        title: a.title,
        source: a.source?.name,
        url: a.url,
      })),
    };
  }

  async function fetchCommunity() {
    const res = await axios.get("https://api.stackexchange.com/2.3/questions", {
      params: {
        order: "desc",
        sort: "activity",
        tagged: "javascript;reactjs",
        site: "stackoverflow",
      },
    });
    const items = res.data.items || [];
    const questionCount = items.length;
    const avgScore =
      questionCount === 0
        ? 0
        : items.reduce((sum, q) => sum + (q.score || 0), 0) / questionCount;

    return {
      tagFilter: "javascript;reactjs",
      questionCount,
      avgScore,
    };
  }

  async function fetchWeather() {
    if (!OPENWEATHER_API_KEY) {
      return {
        city: `${OPENWEATHER_CITY}`,
        tempC: 25,
        humidity: 50,
        status: "Unknown",
        condition: "Unknown",
      };
    }

    const res = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: `${OPENWEATHER_CITY},${OPENWEATHER_COUNTRY}`,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    const main = res.data.main;
    const weatherMain = res.data.weather?.[0]?.main || "Clear";

    const status =
      weatherMain === "Thunderstorm" || weatherMain === "Extreme"
        ? "Unstable"
        : "Stable";

    return {
      city: OPENWEATHER_CITY,
      tempC: main.temp,
      humidity: main.humidity,
      status,
      condition: weatherMain,
    };
  }

  // --- Backend history ---

  async function loadHistory() {
    if (!token) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/records`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data || []);
    } catch (err) {
      console.error("loadHistory error:", err.message);
    }
  }

  // --- Build snapshot + send to backend ---

  async function refreshSnapshot() {
    try {
      setLoading(true);

      const [crypto, news, community, weather] = await Promise.all([
        fetchCrypto(),
        fetchNews(),
        fetchCommunity(),
        fetchWeather(),
      ]);

      const aiScore = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            50 +
              (crypto.btcChange24h / 10) * 10 +
              (news.sentimentScore || 0) * 200 +
              (community.avgScore || 0) * 2
          )
        )
      );

      const snapshotObj = {
        timestamp: new Date().toISOString(),
        crypto,
        news,
        community,
        weather,
        aiScore,
      };

      setSnapshot(snapshotObj);

      if (token) {
        await axios.post(`${BACKEND_URL}/api/records`, snapshotObj, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": FRONTEND_API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        await loadHistory();
      }
    } catch (err) {
      console.error("refreshSnapshot error:", err);
      alert("Error fetching data (check console).");
    } finally {
      setLoading(false);
    }
  }

  // Load history when user logs in
  useEffect(() => {
    if (token) {
      loadHistory();
    }
  }, [token]);

  const aiScore = snapshot?.aiScore ?? 0;

  return (
    <LayoutShell>
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="df-main">
        <Topbar
          token={token}
          onLogin={loginWithGoogle}
          onLogout={logout}
          onRefresh={refreshSnapshot}
          loading={loading}
        />

        <div className="df-content">
          {activeSection === "overview" && (
            <>
              <section className="df-row df-row-top">
                <GaugeCard score={aiScore} />

                <div className="df-kpi-grid">
                  <KpiCard
                    label="BTC 24h"
                    value={
                      snapshot
                        ? `${snapshot.crypto.btcChange24h.toFixed(2)}%`
                        : "--"
                    }
                    hint={snapshot?.crypto?.trend || "–"}
                  />
                  <KpiCard
                    label="News Sentiment"
                    value={snapshot?.news?.sentimentLabel || "--"}
                    hint={
                      snapshot
                        ? snapshot.news.sentimentScore.toFixed(3)
                        : "waiting"
                    }
                  />
                  <KpiCard
                    label="Community Heat"
                    value={
                      snapshot?.community
                        ? snapshot.community.questionCount
                        : "--"
                    }
                    hint={snapshot?.community?.tagFilter || ""}
                  />
                  <KpiCard
                    label="Weather"
                    value={
                      snapshot?.weather ? `${snapshot.weather.tempC}°C` : "--"
                    }
                    hint={snapshot?.weather?.status || ""}
                  />
                </div>
              </section>

              <section className="df-grid">
                <Panel title="Crypto Market">
                  {snapshot ? (
                    <div className="df-panel-body">
                      <div className="df-metric-row">
                        <span>BTC Price</span>
                        <span className="mono">
                          {snapshot.crypto.btcPrice.toLocaleString()} USD
                        </span>
                      </div>
                      <div className="df-metric-row">
                        <span>24h Change</span>
                        <span
                          className={
                            snapshot.crypto.btcChange24h >= 0
                              ? "df-chip-pos"
                              : "df-chip-neg"
                          }
                        >
                          {snapshot.crypto.btcChange24h.toFixed(2)}%
                        </span>
                      </div>
                      <div className="df-metric-row">
                        <span>Trend</span>
                        <span>{snapshot.crypto.trend}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="df-empty">
                      Click “Refresh Snapshot” to load.
                    </p>
                  )}
                </Panel>

                <Panel title="Tech News Sentiment">
                  {snapshot ? (
                    <div className="df-panel-body">
                      <div className="df-metric-row">
                        <span>Sentiment</span>
                        <span>{snapshot.news.sentimentLabel}</span>
                      </div>
                      <div className="df-sentiment-bar">
                        <div
                          className="df-sentiment-fill"
                          style={{
                            transform: `translateX(${
                              (snapshot.news.sentimentScore || 0) * 100
                            }%)`,
                          }}
                        />
                      </div>
                      <ul className="df-list">
                        {snapshot.news.topHeadlines.slice(0, 3).map((h) => (
                          <li key={h.url}>
                            <a href={h.url} target="_blank" rel="noreferrer">
                              {h.title}
                            </a>
                            <span className="df-subtext">{h.source}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="df-empty">No headlines loaded yet.</p>
                  )}
                </Panel>

                <Panel title="Community (StackOverflow)">
                  {snapshot ? (
                    <div className="df-panel-body">
                      <div className="df-metric-row">
                        <span>Tag Filter</span>
                        <span className="mono">
                          {snapshot.community.tagFilter}
                        </span>
                      </div>
                      <div className="df-metric-row">
                        <span>Questions (recent)</span>
                        <span>{snapshot.community.questionCount}</span>
                      </div>
                      <div className="df-metric-row">
                        <span>Average Score</span>
                        <span>{snapshot.community.avgScore.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="df-empty">No community data yet.</p>
                  )}
                </Panel>

                <Panel title="Weather & Stability">
                  {snapshot ? (
                    <div className="df-panel-body">
                      <div className="df-metric-row">
                        <span>City</span>
                        <span>{snapshot.weather.city}</span>
                      </div>
                      <div className="df-metric-row">
                        <span>Temperature</span>
                        <span>{snapshot.weather.tempC}°C</span>
                      </div>
                      <div className="df-metric-row">
                        <span>Condition</span>
                        <span>{snapshot.weather.condition}</span>
                      </div>
                      <div className="df-metric-row">
                        <span>Status</span>
                        <span
                          className={
                            snapshot.weather.status === "Stable"
                              ? "df-chip-pos"
                              : "df-chip-warn"
                          }
                        >
                          {snapshot.weather.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="df-empty">Weather not loaded yet.</p>
                  )}
                </Panel>
              </section>
            </>
          )}

          {activeSection === "history" && <HistoryPanel history={history} />}

          {activeSection === "settings" && (
            <section className="df-card df-panel">
              <h2 className="df-panel-title">Settings</h2>
              <p className="df-subtext">
                You can extend this section with user preferences (tags, city,
                theme) stored in MongoDB.
              </p>
            </section>
          )}
        </div>
      </div>
    </LayoutShell>
  );
}

export default App;
