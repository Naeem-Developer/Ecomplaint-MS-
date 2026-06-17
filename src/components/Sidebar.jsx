import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, FileText, PlusCircle, User, Users, LogOut, X, BarChart, Search, Folder, Plus, GraduationCap, ShieldCheck, StickyNote, Clipboard, Home } from 'lucide-react';
import './Sidebar.css';
import logo from '../assets/logo.png';

/* ─── Quick-capture actions per role ─────────────────────── */
const QUICK_STUDENT = [
  { to: '/submit-complaint', icon: <Plus size={15} strokeWidth={3} />,      label: 'New Complaint' },
  { to: '/my-complaints',   icon: <StickyNote size={15} strokeWidth={3} />,       label: 'My Complaints' },
  { to: '/profile',         icon: <User size={15} strokeWidth={3} />,       label: 'Profile' },
];

const QUICK_ADMIN = [
  { to: '/admin/complaints', icon: <Clipboard size={15} strokeWidth={3} />, label: 'All Cases' },
  { to: '/admin/users',      icon: <Users size={15} strokeWidth={3} />,     label: 'Users' },
  { to: '/profile',          icon: <User size={15} strokeWidth={3} />,      label: 'Profile' },
];

/* ─── Main nav links per role ─────────────────────────────── */
const NAV_STUDENT = [
  { to: '/dashboard',        icon: <LayoutGrid size={18} />, label: 'Dashboard' },
  { to: '/my-complaints',    icon: <Folder size={18} />,      label: 'My Complaints' },
  { to: '/submit-complaint', icon: <PlusCircle size={18} />,  label: 'Submit Complaint' },
  { to: '/profile',          icon: <User size={18} />,        label: 'Profile' },
];

const NAV_ADMIN = [
  { to: '/admin',            icon: <BarChart size={18} />,       label: 'Dashboard' },
  { to: '/admin/complaints', icon: <Search size={18} />, label: 'All Complaints' },
  { to: '/admin/users',      icon: <Users size={18} />,          label: 'Users' },
  { to: '/profile',          icon: <User size={18} />,           label: 'Profile' },
];

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const isAdmin   = user.role === 'admin';
  const navItems  = isAdmin ? NAV_ADMIN   : NAV_STUDENT;
  const quickItems= isAdmin ? QUICK_ADMIN : QUICK_STUDENT;

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>

        {/* ── Logo / Brand ───────────────────────────────── */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <img src={logo} alt="Logo" />
            </div>
            <span>E-Complaint MS</span>
          </div>
          <button className="sidebar-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* ── User pill ──────────────────────────────────── */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user.avatar
              ? <img src={`http://localhost:5000${user.avatar}`} alt={user.name} />
              : user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-details">
            <span className="sidebar-user-name">{user.name}</span>
            <span className="sidebar-user-role">
              {isAdmin ? '🛡 Admin' : user.role === 'faculty' ? '🎓 Faculty' : '👤 Student'}
            </span>
            {user.role === 'faculty' && user.department && (
              <span className="sidebar-user-dept">{user.department}</span>
            )}
          </div>
        </div>

        {/* ── Quick Capture ──────────────────────────────── */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Quick Capture</div>
          {quickItems.map(({ to, icon, label }) => (
            <Link key={to} to={to} className="sidebar-quick-link" onClick={onClose}>
              <span className="sidebar-quick-icon">{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* ── Navigation ─────────────────────────────────── */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Navigation</div>
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin' || to === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ── Footer ─────────────────────────────────────── */}
        <div className="sidebar-footer">
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-link-icon"><LogOut size={18} /></span>
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
