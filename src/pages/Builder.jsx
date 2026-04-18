import { useState } from 'react';
import { generateResume, triggerDownload } from '../api/api.js';

export default function Builder() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [summary, setSummary] = useState('');
  const [template, setTemplate] = useState('Modern');
  const [outputFormat, setOutputFormat] = useState('docx');
  const [saveToDb, setSaveToDb] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      personal_info: {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
      summary,
      experience: [],
      education: [],
      projects: [],
      skills: {},
      template,
      output_format: outputFormat,
      save_to_db: saveToDb,
    };
    try {
      const { blob, filename } = await generateResume(payload);
      triggerDownload(blob, filename);
    } catch (err) {
      let msg = err.message ?? 'Build failed';
      const data = err.response?.data;
      if (data instanceof Blob && data.type?.includes('application/json')) {
        try {
          const text = await data.text();
          const j = JSON.parse(text);
          msg = typeof j.detail === 'string' ? j.detail : text;
        } catch {
          msg = 'Build failed';
        }
      } else if (typeof err.response?.data?.detail === 'string') {
        msg = err.response.data.detail;
      }
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Resume builder</h2>
      <p style={{ color: '#475569' }}>
        <code>POST /builder/generate</code> with JSON body (<code>ResumeData</code>
        ). Response is a file (<code>FileResponse</code>) — downloaded as a blob.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="fn">Full name</label>
          <input
            id="fn"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="em">Email</label>
          <input
            id="em"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="ph">Phone</label>
          <input
            id="ph"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="sum">Summary</label>
          <textarea
            id="sum"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="tpl">Template</label>
          <input
            id="tpl"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="fmt">Output</label>
          <select
            id="fmt"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <option value="docx">DOCX</option>
            <option value="pdf">PDF (needs Word + docx2pdf on server)</option>
          </select>
        </div>
        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={saveToDb}
              onChange={(e) => setSaveToDb(e.target.checked)}
            />{' '}
            Save resume JSON to database
          </label>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Generating…' : 'Generate & download'}
        </button>
      </form>
      {error ? <p className="err">{error}</p> : null}
    </div>
  );
}
