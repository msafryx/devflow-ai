function KpiCard({ label, value, hint }) {
  return (
    <div className="df-card df-kpi-card">
      <span className="df-kpi-label">{label}</span>
      <span className="df-kpi-value">{value}</span>
      {hint && <span className="df-kpi-hint">{hint}</span>}
    </div>
  );
}

export default KpiCard;
