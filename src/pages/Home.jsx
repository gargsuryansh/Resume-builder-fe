import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { healthCheck } from '../api/api.js';

/** Public Lottie asset (documents / success vibe). */
const SAMPLE_LOTTIE =
  'https://assets5.lottiefiles.com/packages/lf20_kuhijlvx.json';

export default function Home() {
  const [health, setHealth] = useState(null);
  const [healthErr, setHealthErr] = useState('');

  useEffect(() => {
    healthCheck()
      .then(() => setHealth('ok'))
      .catch(() => setHealthErr('API unreachable (start uvicorn :8000 or Docker).'));
  }, []);

  return (
    <div>
      <div className="card">
        <h2>Smart AI Resume Analyzer</h2>
        <p>
          React frontend shell for the FastAPI backend. Sign in under{' '}
          <strong>Admin login</strong>, then open the sidebar sections (same areas
          as the former Streamlit sidebar).
        </p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.75rem' }}>
          <strong>API health</strong> (<code>GET /health</code>):{' '}
          {health === 'ok' ? (
            <span style={{ color: '#047857' }}>ok</span>
          ) : healthErr ? (
            <span className="err">{healthErr}</span>
          ) : (
            <span style={{ color: '#64748b' }}>checking…</span>
          )}
        </p>
      </div>
      <div className="card" style={{ maxWidth: 420 }}>
        <Lottie
          loop
          play
          path={SAMPLE_LOTTIE}
          style={{ height: 220 }}
        />
      </div>
    </div>
  );
}
