// src/components/Topbar.jsx
import React from "react";

function Topbar({ token, user, onLogin, onLogout, onRefresh, loading }) {
  const now = new Date().toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const firstLetter = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <header className="df-topbar">
      {/* Left tiny brand tag */}
      <div className="df-topbar-left">
        <span className="df-app-tag">DevFlow • AI Ecosystem</span>
      </div>

      {/* Centered title + subtitle */}
      <div className="df-topbar-center">
        <h1 className="df-page-title">Developer Ecosystem Monitor</h1>
        <p className="df-page-subtitle">
          Real-time telemetry across crypto, GitHub, news, community & climate.
        </p>
      </div>

      {/* Right actions */}
      <div className="df-topbar-right">
        <span className="df-clock">{now}</span>

        <button
          className="df-btn df-btn-ghost"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh Snapshot"}
        </button>

        {token && user ? (
          <>
            <div className="df-user-badge">
              <div className="df-user-avatar">{firstLetter}</div>
              <span className="df-user-name">{user.name}</span>
            </div>
            <button className="df-btn df-btn-outline" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="df-btn df-btn-primary" onClick={onLogin}>
            Continue with Google
          </button>
        )}
      </div>
    </header>
  );
}

export default Topbar;
