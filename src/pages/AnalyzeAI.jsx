import { useEffect, useMemo, useState } from 'react';
import { analyzeAi, fetchJobRoles } from '../api/api.js';

export default function AnalyzeAI() {
  const [jobRoles, setJobRoles] = useState({});
  const [category, setCategory] = useState('');
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [model, setModel] = useState('Google Gemini');
  const [saveToDb, setSaveToDb] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobRoles()
      .then((data) => {
        setJobRoles(data);
        const cats = Object.keys(data);
        if (cats.length && !category) setCategory(cats[0]);
      })
      .catch(() => setError('Could not load job roles'));
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
    fd.append('custom_job_description', customJobDescription);
    fd.append('model', model);
    fd.append('save_to_db', saveToDb ? 'true' : 'false');
    setLoading(true);
    try {
      const data = await analyzeAi(fd);
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
        <h2>AI analysis</h2>
        <p style={{ color: '#475569' }}>
          <code>POST /analyze/ai</code> — form fields map to{' '}
          <code>AIAnalysisRequest</code>.
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
            <label htmlFor="jd">Custom job description (optional)</label>
            <textarea
              id="jd"
              value={customJobDescription}
              onChange={(e) => setCustomJobDescription(e.target.value)}
              placeholder="Paste a full JD to override built-in role text…"
            />
          </div>
          <div className="field">
            <label htmlFor="model">Model</label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="Google Gemini">Google Gemini</option>
              <option value="Anthropic Claude">Anthropic Claude</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="file">Resume file</label>
            <input
              id="file"
              type="file"
              accept=".pdf,.docx,.txt"
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
              Save AI stats to database
            </label>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Running…' : 'Run AI analysis'}
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
