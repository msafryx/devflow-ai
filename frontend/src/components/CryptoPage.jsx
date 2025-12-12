// src/components/CryptoPage.jsx
import React from "react";

function CryptoPage({ snapshotCrypto }) {
  if (!snapshotCrypto) {
    return (
      <section className="df-card df-panel ">
        <h2 className="df-panel-title">Crypto Markets</h2>
        <p className="df-empty">
          No crypto data yet. Go to Overview and click “Refresh Snapshot”.
        </p>
      </section>
    );
  }

  const { coins, trend } = snapshotCrypto;

  return (
    <section className="df-card df-panel df-page-root">
      <h2 className="df-panel-title">Crypto Markets – Top 20 by Market Cap</h2>
      <p className="df-subtext">Overall trend: {trend}</p>

      <div className="df-history" style={{ marginTop: "0.8rem" }}>
        <table className="df-table">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Symbol</th>
              <th>Price (USD)</th>
              <th>24h Change</th>
              <th>Market Cap</th>
              <th>Volume 24h</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.symbol}</td>
                <td>{c.price.toLocaleString()}</td>
                <td
                  className={c.change24h >= 0 ? "df-chip-pos" : "df-chip-neg"}
                >
                  {c.change24h.toFixed(2)}%
                </td>
                <td>{c.marketCap.toLocaleString()}</td>
                <td>{c.volume.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CryptoPage;
