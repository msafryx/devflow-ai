function HistoryPanel({ history }) {
  return (
    <section className="df-card df-panel">
      <h2 className="df-panel-title">Snapshot History</h2>
      {history.length === 0 ? (
        <p className="df-empty">
          No snapshots saved yet. Log in with Google and refresh to store data.
        </p>
      ) : (
        <div className="df-history">
          <table className="df-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>AI Score</th>
                <th>BTC 24h</th>
                <th>Sentiment</th>
                <th>Questions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h._id}>
                  <td>
                    {new Date(h.timestamp).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>{h.aiScore}</td>
                  <td>
                    {h.crypto ? `${h.crypto.btcChange24h.toFixed(2)}%` : "--"}
                  </td>
                  <td>{h.news?.sentimentLabel || "--"}</td>
                  <td>{h.community?.questionCount ?? "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default HistoryPanel;
