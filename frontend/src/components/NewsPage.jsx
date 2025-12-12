// src/components/NewsPage.jsx
import React from "react";

function NewsPage({ snapshotNews }) {
  if (!snapshotNews) {
    return (
      <section className="df-card df-panel df-page-root">
        <h2 className="df-panel-title">Tech News</h2>
        <p className="df-empty">
          No news data yet. Go to Overview and click “Refresh Snapshot”.
        </p>
      </section>
    );
  }

  const { sentimentLabel, topHeadlines, sentimentScore } = snapshotNews;

  return (
    <section className="df-card df-panel df-page-root">
      <h2 className="df-panel-title">Tech News – Developer Ecosystem</h2>
      <p className="df-subtext">
        Sentiment: {sentimentLabel} ({sentimentScore.toFixed(3)})
      </p>

      <div className="df-history" style={{ marginTop: "0.8rem" }}>
        <table className="df-table">
          <thead>
            <tr>
              <th>Headline</th>
              <th>Source</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {topHeadlines.map((h) => (
              <tr key={h.url}>
                <td>
                  <a href={h.url} target="_blank" rel="noreferrer">
                    {h.title}
                  </a>
                </td>
                <td>{h.source || "—"}</td>
                <td>{h.author || "—"}</td>
                <td>
                  {h.publishedAt
                    ? new Date(h.publishedAt).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default NewsPage;
