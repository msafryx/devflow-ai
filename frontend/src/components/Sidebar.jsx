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
            activeSection === "history" ? "active" : ""
          }`}
          onClick={() => setActiveSection("history")}
        >
          History
        </button>
        <button
          className={`df-nav-item ${
            activeSection === "settings" ? "active" : ""
          }`}
          onClick={() => setActiveSection("settings")}
        >
          Settings
        </button>
      </nav>

      <div className="df-sidebar-footer">
        <span className="df-pill df-pill-online">LIVE • CLIENT</span>
        <span className="df-build">v0.1-alpha</span>
      </div>
    </aside>
  );
}

export default Sidebar;
