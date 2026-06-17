import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import authIllustration from '../assets/auth-illustration.png';
import logo from '../assets/logo.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      const dest = from || (user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-split-card">
        {/* Left Illustration Side */}
        <div className="auth-split-left">
          <div style={{ marginBottom: '20px' }}>
            <h2 className="auth-title" style={{ marginBottom: '4px' }}>Welcome back</h2>
            <p className="auth-subtitle">Make sure your account is secure</p>
          </div>
          <img src={authIllustration} alt="Login Illustration" />
        </div>

        {/* Right Form Side */}
        <div className="auth-split-right">
          {/* Logo */}
          <div className="auth-logo" style={{ justifyContent: 'center', marginBottom: '32px' }}>
            <div className="auth-logo-icon">
              <img src={logo} alt="Logo" />
            </div>
            <span className="auth-logo-text">E-Complaint MS</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Link to="/" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={14} /> Home
            </Link>
            <span style={{ fontSize: '.9rem', color: 'var(--gray-500)' }}>Login to your account</span>
          </div>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon-left" />
                <input
                  type="email"
                  name="email"
                  className="form-input input-with-icon-left"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon-left" />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  className="form-input input-with-icon-left input-with-icon-right"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="input-icon-right" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Links side-by-side */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              marginTop: '-8px'
            }}>
              <Link to="/forgot-password" style={{ fontSize: '.82rem', color: 'var(--gray-500)' }}>
                Forgot password?
              </Link>
              <Link to="/register" className="auth-link" style={{ fontSize: '.82rem' }}>
                Register
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 'var(--radius-full)' }} disabled={loading}>
              {loading ? 'Signing in...' : 'LOGIN'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default Login;
