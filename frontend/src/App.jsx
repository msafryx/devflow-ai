import { useEffect, useState } from "react";
import axios from "axios";

import LayoutShell from "./components/LayoutShell.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import GaugeCard from "./components/GaugeCard.jsx";
import KpiCard from "./components/KpiCard.jsx";
import Panel from "./components/Panel.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import GithubPage from "./components/GithubPage.jsx";
import WeatherPage from "./components/WeatherPage.jsx";
import CryptoPage from "./components/CryptoPage.jsx";
import NewsPage from "./components/NewsPage.jsx";
import CommunityPage from "./components/CommunityPage.jsx";

const FRONTEND_API_KEY = import.meta.env.VITE_FRONTEND_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function decodeUserFromToken(token) {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    const data = JSON.parse(atob(payload));
    return { name: data.name || "User" };
  } catch {
    return null;
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("devflow_token"));
  const [user, setUser] = useState(() =>
    decodeUserFromToken(localStorage.getItem("devflow_token"))
  );

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
      setUser(decodeUserFromToken(urlToken));
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
    setUser(null);
    setSnapshot(null);
    setHistory([]);
  }

  // --- Public API fetchers ---

  // 1) GitHub trending repos (top JS repos by stars)
  async function fetchGithub() {
    const res = await axios.get("https://api.github.com/search/repositories", {
      params: {
        q: "stars:>1000 language:javascript",
        sort: "stars",
        order: "desc",
        per_page: 20,
      },
    });

    const items = res.data.items || [];
    const topRepos = items.slice(0, 20).map((repo) => ({
      id: repo.id,
      name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      url: repo.html_url,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
    }));

    return {
      totalCount: res.data.total_count,
      topRepos,
      languageFocus: "JavaScript · stars desc",
    };
  }

  // 2) Crypto – top 20 coins by market cap
  async function fetchCrypto() {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 20,
          page: 1,
          sparkline: false,
          price_change_percentage: "24h",
        },
      }
    );

    const coins = res.data || [];
    const btc = coins.find((c) => c.id === "bitcoin") || coins[0];

    const change = btc?.price_change_percentage_24h ?? 0;
    let trend = "Sideways";
    if (change > 3) trend = "Bullish";
    else if (change < -3) trend = "Bearish";

    const mappedCoins = coins.map((c) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      price: c.current_price,
      change24h: c.price_change_percentage_24h,
      marketCap: c.market_cap,
      volume: c.total_volume,
      image: c.image,
    }));

    return {
      btcPrice: btc?.current_price ?? null,
      btcChange24h: change,
      trend,
      coins: mappedCoins,
    };
  }

  // 3) News sentiment – with extended headlines
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
        pageSize: 20,
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

    const headlines = articles.map((a) => ({
      title: a.title,
      source: a.source?.name,
      url: a.url,
      author: a.author,
      publishedAt: a.publishedAt,
    }));

    return {
      sentimentScore: normalized,
      sentimentLabel: label,
      topHeadlines: headlines,
    };
  }

  // 4) StackOverflow community
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

    const topQuestions = items.slice(0, 20).map((q) => ({
      id: q.question_id,
      title: q.title,
      score: q.score,
      owner: q.owner?.display_name,
      tags: q.tags,
      link: `https://stackoverflow.com/questions/${q.question_id}`,
      creationDate: q.creation_date * 1000,
    }));

    return {
      tagFilter: "javascript;reactjs",
      questionCount,
      avgScore,
      topQuestions,
    };
  }

  // 5) Weather – based on IP location
  async function fetchWeather() {
    try {
      const locRes = await axios.get("https://ipapi.co/json/");
      const { city, country_name: country, latitude, longitude } = locRes.data;

      if (!OPENWEATHER_API_KEY) {
        return {
          city,
          country,
          tempC: 25,
          feelsLike: 25,
          humidity: 50,
          pressure: 1013,
          status: "Unknown",
          condition: "Unknown",
          windSpeed: 0,
          windDeg: 0,
          visibility: 0,
          sunrise: null,
          sunset: null,
        };
      }

      const weatherRes = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat: latitude,
            lon: longitude,
            appid: OPENWEATHER_API_KEY,
            units: "metric",
          },
        }
      );

      const main = weatherRes.data.main;
      const weatherMain = weatherRes.data.weather?.[0]?.main || "Clear";
      const description =
        weatherRes.data.weather?.[0]?.description || weatherMain;
      const sys = weatherRes.data.sys || {};
      const wind = weatherRes.data.wind || {};

      const status =
        weatherMain === "Thunderstorm" || weatherMain === "Extreme"
          ? "Unstable"
          : "Stable";

      return {
        city,
        country,
        tempC: main.temp,
        feelsLike: main.feels_like,
        humidity: main.humidity,
        pressure: main.pressure,
        status,
        condition: description,
        windSpeed: wind.speed,
        windDeg: wind.deg,
        visibility: weatherRes.data.visibility,
        sunrise: sys.sunrise ? sys.sunrise * 1000 : null,
        sunset: sys.sunset ? sys.sunset * 1000 : null,
      };
    } catch (err) {
      console.error("Weather fetch error:", err.message);
      return {
        city: "Unknown",
        country: "",
        tempC: 25,
        feelsLike: 25,
        humidity: 50,
        pressure: 1013,
        status: "Unknown",
        condition: "Unknown",
        windSpeed: 0,
        windDeg: 0,
        visibility: 0,
        sunrise: null,
        sunset: null,
      };
    }
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

      const [github, crypto, news, community, weather] = await Promise.all([
        fetchGithub(),
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
        github,
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
          user={user}
          onLogin={loginWithGoogle}
          onLogout={logout}
          onRefresh={refreshSnapshot}
          loading={loading}
        />

        <div className="df-content">
          {/* OVERVIEW */}
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
                    hint={snapshot?.weather?.city || ""}
                  />
                </div>
              </section>

              <section className="df-grid">
                <Panel title="GitHub Trending">
                  {snapshot ? (
                    <div className="df-panel-body">
                      <div className="df-metric-row">
                        <span>Focus</span>
                        <span className="mono">
                          {snapshot.github.languageFocus}
                        </span>
                      </div>
                      <div className="df-metric-row">
                        <span>Repos (shown)</span>
                        <span>{snapshot.github.topRepos.length}</span>
                      </div>
                      <ul className="df-list">
                        {snapshot.github.topRepos.slice(0, 3).map((r) => (
                          <li key={r.id}>
                            <a href={r.url} target="_blank" rel="noreferrer">
                              {r.name}
                            </a>
                            <span className="df-subtext">
                              ⭐ {r.stars} · {r.language || "Unknown"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="df-empty">
                      Click "Refresh Snapshot" to load GitHub data.
                    </p>
                  )}
                </Panel>

                <Panel title="Crypto Market">
                  {snapshot ? (
                    <div className="df-panel-body">
                      <div className="df-metric-row">
                        <span>BTC Price</span>
                        <span className="mono">
                          {snapshot.crypto.btcPrice?.toLocaleString()} USD
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
                        <span>Location</span>
                        <span>
                          {snapshot.weather.city}, {snapshot.weather.country}
                        </span>
                      </div>
                      <div className="df-metric-row">
                        <span>Temperature</span>
                        <span>{snapshot.weather.tempC}°C</span>
                      </div>
                      <div className="df-metric-row">
                        <span>Feels Like</span>
                        <span>{snapshot.weather.feelsLike}°C</span>
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

          {/* DETAIL PAGES */}
          {activeSection === "github" && (
            <GithubPage snapshotGithub={snapshot?.github} />
          )}

          {activeSection === "crypto" && (
            <CryptoPage snapshotCrypto={snapshot?.crypto} />
          )}

          {activeSection === "news" && (
            <NewsPage snapshotNews={snapshot?.news} />
          )}

          {activeSection === "community" && (
            <CommunityPage snapshotCommunity={snapshot?.community} />
          )}

          {activeSection === "weather" && (
            <WeatherPage snapshotWeather={snapshot?.weather} />
          )}

          {activeSection === "history" && <HistoryPanel history={history} />}
        </div>
      </div>
    </LayoutShell>
  );
}

export default App;
