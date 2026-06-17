import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';
import forgotPasswordIllustration from '../assets/forgot-password-illustration.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset instructions sent!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card auth-card-split">
        <div className="auth-card-visual">
          <img src={forgotPasswordIllustration} alt="Forgot password illustration" className="auth-illustration" />
        </div>
        <div className="auth-card-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <img src={logo} alt="Logo" />
            </div>
            <span className="auth-logo-text">E-Complaint MS</span>
          </div>

          <h1 className="auth-title">Reset password</h1>
          <p className="auth-subtitle">
            {sent
              ? 'Check your email for reset instructions.'
              : "Enter your email and we'll send you a reset link."}
          </p>

        {error && <div className="alert alert-error">{error}</div>}

        {sent ? (
          <div className="alert alert-success">
            Reset link sent! Check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon-left" />
                <input
                  type="email"
                  className="form-input input-with-icon-left"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Sending...' : <><Send size={16} /> PaperPlaneRight Reset Link</>}
            </button>
          </form>
        )}

        <p className="auth-footer" style={{ marginTop: '20px' }}>
          <Link to="/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;


