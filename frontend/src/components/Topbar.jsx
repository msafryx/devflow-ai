function Topbar({ token, onLogin, onLogout, onRefresh, loading }) {
  const now = new Date().toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="df-topbar">
      <div>
        <h1 className="df-page-title">Developer Ecosystem Monitor</h1>
        <p className="df-page-subtitle">
          Real-time telemetry across crypto, news, community & climate.
        </p>
      </div>

      <div className="df-topbar-right">
        <span className="df-clock">{now}</span>
        <button
          className="df-btn df-btn-ghost"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh Snapshot"}
        </button>
        {token ? (
          <button className="df-btn df-btn-outline" onClick={onLogout}>
            Logout
          </button>
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
