export function AnalyticsChart() {
  const data = [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 24 },
    { label: 'Mar', value: 18 },
    { label: 'Apr', value: 42 },
    { label: 'May', value: 38 },
    { label: 'Jun', value: 55 },
  ];
  const max = Math.max(...data.map(d => d.value));

  return (
    <article className="workspace-card workspace-card--full" style={{ marginBottom: '1.5rem' }}>
      <h2 className="workspace-card-title">Interest Earned Over Time</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '1rem', marginTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', maxWidth: '40px', background: '#7e2fd0', borderRadius: '4px 4px 0 0', height: `${(d.value / max) * 100}%`, transition: 'height 0.3s ease' }}></div>
            <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{d.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
