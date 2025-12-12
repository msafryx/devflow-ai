// src/components/GithubPage.jsx
import React from "react";

function GithubPage({ snapshotGithub }) {
  if (!snapshotGithub) {
    return (
      <section className="df-card df-panel df-page-root">
        <h2 className="df-panel-title">GitHub Trending</h2>
        <p className="df-empty">
          No data yet. Go to Overview and click “Refresh Snapshot”.
        </p>
      </section>
    );
  }

  const { languageFocus, topRepos } = snapshotGithub;

  return (
    <section className="df-card df-panel df-page-root">
      <h2 className="df-panel-title">GitHub Trending Repositories</h2>
      <p className="df-subtext">
        Focus: <span className="mono">{languageFocus}</span>
      </p>

      <div className="df-history" style={{ marginTop: "0.8rem" }}>
        <table className="df-table">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Description</th>
              <th>Language</th>
              <th>⭐ Stars</th>
              <th>Forks</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            {topRepos.map((r) => (
              <tr key={r.id}>
                <td>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.name}
                  </a>
                </td>
                <td>{r.description || "—"}</td>
                <td>{r.language || "—"}</td>
                <td>{r.stars.toLocaleString()}</td>
                <td>{r.forks.toLocaleString()}</td>
                <td>{r.issues.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default GithubPage;
