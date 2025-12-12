// src/components/WeatherPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function formatTime(ms) {
  if (!ms) return "—";
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function WeatherPage({ snapshotWeather }) {
  const [popularWeather, setPopularWeather] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const POPULAR_CITIES = ["London", "New York", "Dubai", "Tokyo", "Sydney"];

  useEffect(() => {
    if (!OPENWEATHER_API_KEY) return;
    let cancelled = false;

    async function loadPopular() {
      try {
        setLoadingPopular(true);
        const results = await Promise.all(
          POPULAR_CITIES.map((city) =>
            axios
              .get("https://api.openweathermap.org/data/2.5/weather", {
                params: {
                  q: city,
                  appid: OPENWEATHER_API_KEY,
                  units: "metric",
                },
              })
              .then((res) => res.data)
          )
        );

        if (cancelled) return;

        const mapped = results.map((w) => ({
          id: w.id,
          name: w.name,
          tempC: w.main.temp,
          feelsLike: w.main.feels_like,
          condition: w.weather?.[0]?.description ?? "Unknown",
          country: w.sys?.country ?? "",
        }));

        setPopularWeather(mapped);
      } catch (err) {
        console.error("Popular weather error:", err.message);
      } finally {
        if (!cancelled) setLoadingPopular(false);
      }
    }

    loadPopular();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setSearchResult(null);

    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    if (!OPENWEATHER_API_KEY) {
      setError("OpenWeather API key is not configured.");
      return;
    }

    try {
      setSearchLoading(true);
      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: trimmed,
            appid: OPENWEATHER_API_KEY,
            units: "metric",
          },
        }
      );

      const data = res.data;

      setSearchResult({
        name: data.name,
        country: data.sys?.country ?? "",
        tempC: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        condition: data.weather?.[0]?.description ?? "Unknown",
        windSpeed: data.wind?.speed ?? 0,
        windDeg: data.wind?.deg ?? 0,
      });
    } catch (err) {
      console.error("Search weather error:", err.message);
      setError("Could not find that city. Try another name.");
    } finally {
      setSearchLoading(false);
    }
  }

  const w = snapshotWeather || null;

  return (
    <section className="df-card df-panel df-page-root">
      <h2 className="df-panel-title df-weather-title">
        Weather &amp; Stability
      </h2>
      <p className="df-subtext">
        View your local conditions, explore common developer hubs, and search
        weather in any city.
      </p>

      {/* Local + search */}
      <div className="df-weather-grid-main">
        <div className="df-weather-block df-weather-local">
          <h3>Your Location</h3>
          {w ? (
            <>
              <p className="df-weather-main">
                {w.city}, {w.country}
              </p>
              <p className="df-weather-temp">
                {w.tempC}°C · feels like {w.feelsLike}°C
              </p>
              <p className="df-weather-desc">{w.condition}</p>

              <div className="df-weather-meta-row">
                <div>
                  <span className="df-label">Humidity</span>
                  <span>{w.humidity}%</span>
                </div>
                <div>
                  <span className="df-label">Pressure</span>
                  <span>{w.pressure} hPa</span>
                </div>
                <div>
                  <span className="df-label">Visibility</span>
                  <span>{(w.visibility ?? 0) / 1000} km</span>
                </div>
              </div>

              <div className="df-weather-meta-row">
                <div>
                  <span className="df-label">Wind</span>
                  <span>
                    {w.windSpeed} m/s · {w.windDeg}°
                  </span>
                </div>
                <div>
                  <span className="df-label">Sunrise</span>
                  <span>{formatTime(w.sunrise)}</span>
                </div>
                <div>
                  <span className="df-label">Sunset</span>
                  <span>{formatTime(w.sunset)}</span>
                </div>
              </div>

              <p className="df-weather-status">
                Stability:{" "}
                <span
                  className={
                    w.status === "Stable" ? "df-chip-pos" : "df-chip-warn"
                  }
                >
                  {w.status}
                </span>
              </p>
            </>
          ) : (
            <p className="df-empty">
              No local data yet. Go to Overview and refresh a snapshot.
            </p>
          )}
        </div>

        <div className="df-weather-block df-weather-search">
          <h3>Search City</h3>
          <form onSubmit={handleSearch} className="df-weather-search-form">
            <input
              type="text"
              className="df-input"
              placeholder="Enter city name (e.g. Colombo, Berlin)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="df-btn df-btn-primary"
              disabled={searchLoading}
            >
              {searchLoading ? "Searching…" : "Search"}
            </button>
          </form>
          {error && <p className="df-error-text">{error}</p>}

          {searchResult && (
            <div className="df-weather-search-result">
              <p className="df-weather-main">
                {searchResult.name}, {searchResult.country}
              </p>
              <p className="df-weather-temp">
                {searchResult.tempC}°C · feels like {searchResult.feelsLike}°C
              </p>
              <p className="df-weather-desc">{searchResult.condition}</p>

              <div className="df-weather-meta-row">
                <div>
                  <span className="df-label">Humidity</span>
                  <span>{searchResult.humidity}%</span>
                </div>
                <div>
                  <span className="df-label">Pressure</span>
                  <span>{searchResult.pressure} hPa</span>
                </div>
                <div>
                  <span className="df-label">Wind</span>
                  <span>
                    {searchResult.windSpeed} m/s · {searchResult.windDeg}°
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popular dev hubs */}
      <div className="df-weather-popular">
        <h3>Common Dev Hubs</h3>
        <p className="df-subtext">
          Quick view of conditions in a few major developer cities.
        </p>

        {loadingPopular && <p className="df-subtext">Loading cities…</p>}

        {!loadingPopular && (
          <div className="df-weather-grid">
            {popularWeather.map((c) => (
              <div key={c.id} className="df-weather-card">
                <div className="df-weather-card-header">
                  <span className="df-weather-city">
                    {c.name}, {c.country}
                  </span>
                </div>
                <div className="df-weather-card-body">
                  <span className="df-weather-card-temp">{c.tempC}°C</span>
                  <span className="df-weather-card-cond">{c.condition}</span>
                  <span className="df-weather-card-feels">
                    feels like {c.feelsLike}°C
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default WeatherPage;
