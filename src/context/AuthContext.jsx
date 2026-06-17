import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session from httpOnly cookie on mount ─────────────────────────
  useEffect(() => {
    const loggedOut = typeof window !== 'undefined' && window.localStorage.getItem('authLoggedOut');
    if (loggedOut) {
      setUser(null);
      setLoading(false);
      return;
    }

    authAPI.me()
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))   // 401 = not logged in, that's fine
      .finally(() => setLoading(false));
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    // Cookie is set server-side; we just keep the user object in React state
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authLoggedOut');
    }
    setUser(data);
    return data;
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (regData) => {
    const { data } = await authAPI.register(regData);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authLoggedOut');
    }
    setUser(data);
    return data;
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    setUser(null);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('authLoggedOut', 'true');
        window.sessionStorage.clear();
        if (window.caches) {
          window.caches.keys().then(keys => keys.forEach(key => window.caches.delete(key)));
        }
      } catch (e) {
        console.warn('Failed to clear browser storage on logout', e);
      }
    }
  }, []);

  // ── Update local user data (after profile edit) ───────────────────────────
  // Note: just updates React state — nothing stored client-side
  const updateUser = useCallback((updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
