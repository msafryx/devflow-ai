function GaugeCard({ score }) {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = (clamped / 100) * 270 - 135;

  let label = "Critical";
  if (clamped >= 80) label = "Ecosystem Thriving";
  else if (clamped >= 60) label = "Healthy";
  else if (clamped >= 40) label = "Watch Closely";

  return (
    <div className="df-card df-score-card">
      <div className="df-card-header">
        <span className="df-card-title">AI Intelligence Score</span>
        <span className="df-chip">0–100</span>
      </div>
      <div className="df-score-body">
        <div className="df-gauge">
          <div className="df-gauge-arc" />
          <div
            className="df-gauge-needle"
            style={{ transform: `rotate(${angle}deg)` }}
          />
          <div className="df-gauge-center">{clamped}</div>
        </div>
        <div className="df-score-meta">
          <span className="df-score-label">{label}</span>
          <p>
            Composite signal based on crypto volatility, news sentiment,
            community heat & climate stability.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GaugeCard;
