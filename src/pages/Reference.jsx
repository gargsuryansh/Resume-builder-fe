import { useEffect, useState } from 'react';
import { fetchCourses, fetchJobFilters, fetchJobRoles } from '../api/api.js';

export default function Reference() {
  const [jobRoles, setJobRoles] = useState(null);
  const [courses, setCourses] = useState(null);
  const [filters, setFilters] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('roles');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchJobRoles().catch((e) => {
        throw new Error(e?.message ?? 'job_roles');
      }),
      fetchCourses().catch((e) => {
        throw new Error(e?.message ?? 'courses');
      }),
      fetchJobFilters().catch((e) => {
        throw new Error(e?.message ?? 'job_filters');
      }),
    ])
      .then(([jr, co, fi]) => {
        if (!cancelled) {
          setJobRoles(jr);
          setCourses(co);
          setFilters(fi);
        }
      })
      .catch(() => setError('Could not load one or more /config/* endpoints.'));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="card">
        <h2>Config reference</h2>
        <p style={{ color: '#475569' }}>
          Read-only views of public API data:{' '}
          <code>/config/job_roles</code>, <code>/config/courses</code>,{' '}
          <code>/config/job_filters</code>.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            ['roles', 'Job roles'],
            ['courses', 'Courses'],
            ['filters', 'Job filters'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="btn"
              style={{
                background: tab === id ? '#1d4ed8' : '#64748b',
              }}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {error ? <p className="err">{error}</p> : null}
      </div>
      <div className="card">
        {tab === 'roles' && jobRoles ? (
          <pre className="json-out">{JSON.stringify(jobRoles, null, 2)}</pre>
        ) : null}
        {tab === 'courses' && courses ? (
          <pre className="json-out">{JSON.stringify(courses, null, 2)}</pre>
        ) : null}
        {tab === 'filters' && filters ? (
          <pre className="json-out">{JSON.stringify(filters, null, 2)}</pre>
        ) : null}
        {!jobRoles && !error && tab === 'roles' ? (
          <p>Loading…</p>
        ) : null}
      </div>
    </div>
  );
}
