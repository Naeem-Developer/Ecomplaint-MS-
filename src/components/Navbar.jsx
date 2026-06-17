import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { Bell, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onListToggle, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const roleLabel = { admin: 'Administrator', faculty: 'Faculty', student: 'Student' };
  const roleColor = { admin: 'var(--rejected)', faculty: 'var(--secondary-500)', student: 'var(--primary-600)' };

  // Resolve avatar URL: if backend returned a relative path (e.g. /uploads/..),
  // prefix it with the API origin so it works after page refresh and in prod.
  const resolveMedia = (p) => {
    if (!p) return null;
    if (p.startsWith('http')) return p;
    const api = import.meta.env.VITE_API_URL || '/api';
    const base = api.startsWith('http') ? api.replace(/\/api\/?$/, '') : window.location.origin;
    return `${base}${p}`;
  };

  const avatarSrc = user?.avatar ? resolveMedia(user.avatar) : null;

  return (
    <header className={`navbar ${user ? 'dashboard-navbar' : ''}`}>
      <div className="navbar-left">
        {user && (
          <button className="navbar-menu-btn" onClick={onListToggle} aria-label="Toggle sidebar">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="navbar-brand">
          <div className="navbar-brand-icon">
            <img src={logo} alt="Logo" />
          </div>
          <span className="navbar-brand-text">
            E-Complaint <span>MS</span>
          </span>
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <button className="navbar-icon-btn" title="Notifications">
              <Bell size={18} />
              <span className="navbar-badge">3</span>
            </button>

            <div className="navbar-user" onClick={() => setDropdownOpen(o => !o)}>
              <div className="navbar-avatar">
                {avatarSrc
                  ? <img src={avatarSrc} alt={user.name} />
                  : user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="navbar-user-info">
                <span className="navbar-user-name">{user.name}</span>
                <span className="navbar-user-role" style={{ color: roleColor[user.role] }}>
                  {roleLabel[user.role]}
                </span>
              </div>
              <ChevronDown size={14} className={`navbar-chevron ${dropdownOpen ? 'open' : ''}`} />

              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <Link to="/profile" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={15} /> My Profile
                  </Link>
                  <div className="navbar-dropdown-divider" />
                  <button className="navbar-dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="navbar-auth-links">
            <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
