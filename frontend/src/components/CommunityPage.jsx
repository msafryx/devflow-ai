// src/components/CommunityPage.jsx
import React from "react";

function CommunityPage({ snapshotCommunity }) {
  if (!snapshotCommunity) {
    return (
      <section className="df-card df-panel">
        <h2 className="df-panel-title">Community (StackOverflow)</h2>
        <p className="df-empty">
          No community data yet. Go to Overview and click “Refresh Snapshot”.
        </p>
      </section>
    );
  }

  const { tagFilter, questionCount, avgScore, topQuestions } =
    snapshotCommunity;

  return (
    <section className="df-card df-panel df-page-root">
      <h2 className="df-panel-title">StackOverflow Activity</h2>
      <p className="df-subtext">
        Tags: <span className="mono">{tagFilter}</span> • Questions fetched:{" "}
        {questionCount} • Avg score: {avgScore.toFixed(2)}
      </p>

      <div className="df-history" style={{ marginTop: "0.8rem" }}>
        <table className="df-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Score</th>
              <th>Owner</th>
              <th>Tags</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {topQuestions.map((q) => (
              <tr key={q.id}>
                <td>
                  <a href={q.link} target="_blank" rel="noreferrer">
                    {q.title}
                  </a>
                </td>
                <td>{q.score}</td>
                <td>{q.owner || "—"}</td>
                <td>{q.tags.join(", ")}</td>
                <td>
                  {new Date(q.creationDate).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CommunityPage;
