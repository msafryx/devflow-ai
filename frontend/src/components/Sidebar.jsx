function Sidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="df-sidebar">
      <div className="df-logo">
        <div className="df-logo-orb" />
        <div className="df-logo-text">
          <span className="df-logo-main">DevFlow</span>
          <span className="df-logo-sub">AI Ecosystem</span>
        </div>
      </div>

      <nav className="df-nav">
        <button
          className={`df-nav-item ${
            activeSection === "overview" ? "active" : ""
          }`}
          onClick={() => setActiveSection("overview")}
        >
          Overview
        </button>

        <button
          className={`df-nav-item ${
            activeSection === "github" ? "active" : ""
          }`}
          onClick={() => setActiveSection("github")}
        >
          GitHub Trending
        </button>

        <button
          className={`df-nav-item ${
            activeSection === "crypto" ? "active" : ""
          }`}
          onClick={() => setActiveSection("crypto")}
        >
          Crypto Markets
        </button>

        <button
          className={`df-nav-item ${activeSection === "news" ? "active" : ""}`}
          onClick={() => setActiveSection("news")}
        >
          Tech News
        </button>

        <button
          className={`df-nav-item ${
            activeSection === "community" ? "active" : ""
          }`}
          onClick={() => setActiveSection("community")}
        >
          Community (StackOverflow)
        </button>

        <button
          className={`df-nav-item ${
            activeSection === "weather" ? "active" : ""
          }`}
          onClick={() => setActiveSection("weather")}
        >
          Weather & Stability
        </button>

        <button
          className={`df-nav-item ${
            activeSection === "history" ? "active" : ""
          }`}
          onClick={() => setActiveSection("history")}
        >
          History
        </button>
      </nav>

      <div className="df-sidebar-footer">
        <span className="df-pill df-pill-online">LIVE • CLIENT</span>
        <span className="df-build">v0.3-multi-pages</span>
      </div>
    </aside>
  );
}

export default Sidebar;
