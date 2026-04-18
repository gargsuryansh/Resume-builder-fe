import { useState } from 'react';
import { jobsSearch } from '../api/api.js';

export default function Jobs() {
  const [keywords, setKeywords] = useState('Software Engineer');
  const [location, setLocation] = useState('India');
  const [jobCount, setJobCount] = useState(3);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await jobsSearch({
        keywords,
        location,
        job_count: jobCount,
      });
      setResult(data);
    } catch (err) {
      const msg =
        err.response?.data?.detail ?? err.message ?? 'Job search failed';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }

  const rows = Array.isArray(result?.jobs) ? result.jobs : [];

  return (
    <div>
      <div className="card">
        <h2>LinkedIn job search</h2>
        <p style={{ color: '#475569' }}>
          <code>GET /jobs/search</code> — Selenium-backed (requires Chrome / driver on
          the API host).
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="kw">Keywords (comma-separated)</label>
            <input
              id="kw"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="loc">Location</label>
            <input
              id="loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="jc">Job count (1–10)</label>
            <input
              id="jc"
              type="number"
              min={1}
              max={10}
              value={jobCount}
              onChange={(e) =>
                setJobCount(Number.parseInt(e.target.value, 10) || 3)
              }
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
        {error ? <p className="err">{error}</p> : null}
      </div>
      {result?.error ? (
        <div className="card">
          <p className="err">{result.error}</p>
        </div>
      ) : null}
      {rows.length > 0 ? (
        <div className="card">
          <h3>Results ({result?.count ?? rows.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  {Object.keys(rows[0]).map((k) => (
                    <th
                      key={k}
                      style={{
                        textAlign: 'left',
                        borderBottom: '1px solid #e2e8f0',
                        padding: '0.45rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {Object.keys(rows[0]).map((k) => (
                      <td
                        key={k}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          padding: '0.45rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        {String(row[k] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
      {result && !result.error && rows.length === 0 ? (
        <div className="card">
          <pre className="json-out">{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}
