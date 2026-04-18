import { useEffect, useMemo, useState } from 'react';
import { analyzeBasic, fetchJobRoles } from '../api/api.js';

export default function AnalyzeBasic() {
  const [jobRoles, setJobRoles] = useState({});
  const [category, setCategory] = useState('');
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [saveToDb, setSaveToDb] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobRoles()
      .then((data) => {
        setJobRoles(data);
        const cats = Object.keys(data);
        if (cats.length && !category) {
          setCategory(cats[0]);
        }
      })
      .catch(() => setError('Could not load job roles from /config/job_roles'));
  }, []);

  const rolesInCategory = useMemo(() => {
    if (!category || !jobRoles[category]) return [];
    return Object.keys(jobRoles[category]);
  }, [category, jobRoles]);

  useEffect(() => {
    if (rolesInCategory.length && !rolesInCategory.includes(role)) {
      setRole(rolesInCategory[0]);
    }
  }, [rolesInCategory, role]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!file) {
      setError('Choose a resume file.');
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('job_category', category);
    fd.append('job_role', role);
    fd.append('save_to_db', saveToDb ? 'true' : 'false');
    setLoading(true);
    try {
      const data = await analyzeBasic(fd);
      setResult(data);
    } catch (err) {
      const msg =
        err.response?.data?.detail ?? err.message ?? 'Analysis failed';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }

  const categories = Object.keys(jobRoles);

  return (
    <div>
      <div className="card">
        <h2>ATS analysis</h2>
        <p style={{ color: '#475569' }}>
          <code>POST /analyze/basic</code> — multipart form maps to{' '}
          <code>AnalysisRequest</code>.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="cat">Job category</label>
            <select
              id="cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="role">Job role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {rolesInCategory.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="file">Resume (PDF / DOCX)</label>
            <input
              id="file"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="field">
            <label>
              <input
                type="checkbox"
                checked={saveToDb}
                onChange={(e) => setSaveToDb(e.target.checked)}
              />{' '}
              Save to database
            </label>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>
        {error ? <p className="err">{error}</p> : null}
      </div>
      {result ? (
        <div className="card">
          <h3>Response JSON</h3>
          <pre className="json-out">{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}
