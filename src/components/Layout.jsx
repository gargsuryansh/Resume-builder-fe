import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinkClass = ({ isActive }) =>
  isActive ? 'active' : undefined;

export default function Layout() {
  const { isLoggedIn, email, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Resume Analyzer</h1>
        <nav>
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/analyze/basic" className={navLinkClass}>
            ATS analysis
          </NavLink>
          <NavLink to="/analyze/ai" className={navLinkClass}>
            AI analysis
          </NavLink>
          <NavLink to="/builder" className={navLinkClass}>
            Resume builder
          </NavLink>
          <NavLink to="/jobs" className={navLinkClass}>
            Job search
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/feedback" className={navLinkClass}>
            Feedback
          </NavLink>
          <NavLink to="/reference" className={navLinkClass}>
            Config reference
          </NavLink>
          <NavLink to="/admin/tools" className={navLinkClass}>
            Admin tools
          </NavLink>
          {!isLoggedIn ? (
            <NavLink to="/login" className={navLinkClass}>
              Admin login
            </NavLink>
          ) : (
            <>
              <span
                style={{
                  display: 'block',
                  padding: '0.55rem 1rem',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                }}
              >
                {email}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  margin: '0 1rem',
                  width: 'calc(100% - 2rem)',
                  marginTop: '0.5rem',
                }}
                onClick={() => logout()}
              >
                Log out
              </button>
            </>
          )}
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
