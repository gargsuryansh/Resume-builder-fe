import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { setAuthToken } from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => {
    try {
      return localStorage.getItem('admin_token');
    } catch {
      return null;
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('admin_email');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = useCallback((accessToken, userEmail) => {
    try {
      localStorage.setItem('admin_token', accessToken);
      localStorage.setItem('admin_email', userEmail ?? '');
    } catch {
      /* ignore */
    }
    setTokenState(accessToken);
    setEmail(userEmail ?? null);
    setAuthToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
    } catch {
      /* ignore */
    }
    setTokenState(null);
    setEmail(null);
    setAuthToken(null);
  }, []);

  const value = useMemo(
    () => ({
      /** Mirrors Streamlit `st.session_state.is_admin` intent for gated routes */
      isLoggedIn: Boolean(token),
      token,
      email,
      login,
      logout,
    }),
    [token, email, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
