import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { dashboardMetrics } from '../api/api.js';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardMetrics()
      .then(setMetrics)
      .catch((err) => {
        const msg =
          err.response?.data?.detail ?? err.message ?? 'Failed to load metrics';
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card">
        <p>Loading dashboard metrics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p className="err">{error}</p>
      </div>
    );
  }

  const cats = metrics.skill_distribution?.categories ?? [];
  const counts = metrics.skill_distribution?.counts ?? [];
  const wDates = metrics.weekly_trends?.date_labels ?? [];
  const wSubs = metrics.weekly_trends?.submissions ?? [];

  return (
    <div>
      <div className="card">
        <h2>Dashboard metrics</h2>
        <p style={{ color: '#475569' }}>
          From <code>GET /dashboard/metrics</code> — same aggregates as the former
          Streamlit dashboard manager.
        </p>
      </div>
      <div className="split dashboard-split">
        <div className="card">
          <h3>Skill distribution</h3>
          <Plot
            data={[
              {
                type: 'bar',
                x: cats,
                y: counts,
                marker: { color: '#2563eb' },
              },
            ]}
            layout={{
              autosize: true,
              margin: { t: 36, r: 16, l: 48, b: 80 },
              paper_bgcolor: '#fff',
              plot_bgcolor: '#f8fafc',
              xaxis: { tickangle: -35 },
              height: 360,
            }}
            style={{ width: '100%', minHeight: 360 }}
            config={{ responsive: true, displayModeBar: true }}
          />
        </div>
        <div className="card">
          <h3>Weekly submissions</h3>
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'lines+markers',
                x: wDates,
                y: wSubs,
                line: { color: '#059669', width: 2 },
              },
            ]}
            layout={{
              autosize: true,
              margin: { t: 36, r: 16, l: 48, b: 56 },
              paper_bgcolor: '#fff',
              plot_bgcolor: '#f8fafc',
              height: 360,
            }}
            style={{ width: '100%', minHeight: 360 }}
            config={{ responsive: true, displayModeBar: true }}
          />
        </div>
      </div>
      <div className="card">
        <h3>Raw metrics JSON</h3>
        <pre className="json-out">{JSON.stringify(metrics, null, 2)}</pre>
      </div>
    </div>
  );
}
