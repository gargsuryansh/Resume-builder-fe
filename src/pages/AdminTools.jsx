import { useEffect, useState } from 'react';
import {
  adminFeedbackStats,
  exportResumes,
  triggerDownload,
} from '../api/api.js';

export default function AdminTools() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    adminFeedbackStats()
      .then(setStats)
      .catch((err) => {
        const msg =
          err.response?.data?.detail ?? err.message ?? 'Could not load stats';
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleExport(format) {
    setExporting(true);
    setError('');
    try {
      const { blob, filename } = await exportResumes(format);
      triggerDownload(blob, filename);
    } catch (err) {
      let msg = err.message ?? 'Export failed';
      const data = err.response?.data;
      if (data instanceof Blob && data.type?.includes('application/json')) {
        try {
          const text = await data.text();
          const j = JSON.parse(text);
          msg = typeof j.detail === 'string' ? j.detail : text;
        } catch {
          msg = 'Export failed';
        }
      }
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>Admin tools</h2>
        <p style={{ color: '#475569' }}>
          <code>GET /admin/feedback/stats</code> and{' '}
          <code>GET /admin/export/resumes</code> — requires admin JWT.
        </p>

        <h3 style={{ marginTop: '1.25rem' }}>Export resumes</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Downloads joined resume + analysis tables (blob response).
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn"
            disabled={exporting}
            onClick={() => handleExport('excel')}
          >
            Excel
          </button>
          <button
            type="button"
            className="btn"
            disabled={exporting}
            onClick={() => handleExport('csv')}
          >
            CSV
          </button>
          <button
            type="button"
            className="btn"
            disabled={exporting}
            onClick={() => handleExport('json')}
          >
            JSON
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Feedback statistics</h3>
        {loading ? <p>Loading…</p> : null}
        {error ? <p className="err">{error}</p> : null}
        {stats ? (
          <pre className="json-out">{JSON.stringify(stats, null, 2)}</pre>
        ) : null}
      </div>
    </div>
  );
}
