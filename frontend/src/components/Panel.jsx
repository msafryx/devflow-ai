function Panel({ title, children }) {
  return (
    <section className="df-card df-panel">
      <h2 className="df-panel-title">{title}</h2>
      {children}
    </section>
  );
}

export default Panel;
