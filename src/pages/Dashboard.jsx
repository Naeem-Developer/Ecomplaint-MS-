import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  PlusCircle, BookOpen, StickyNote,
  Building, Bus, Home, Book, Shapes,
  ClipboardList, Send, ChevronDown, Wrench,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_MAP = {
  Academic: { icon: <Book size={22} />, bg: 'var(--primary-50)', color: 'var(--primary-600)' },
  Infrastructure: { icon: <Wrench size={22} />, bg: '#f0fdf4', color: 'var(--resolved)' },
  Administration: { icon: <Building size={22} />, bg: 'var(--in_progress-bg)', color: 'var(--in_progress)' },
  Hostel: { icon: <Home size={22} />, bg: 'var(--pending-bg)', color: 'var(--pending)' },
  Library: { icon: <BookOpen size={22} />, bg: 'var(--primary-50)', color: 'var(--primary-500)' },
  Transport: { icon: <Bus size={22} />, bg: '#fdf4ff', color: '#a855f7' },
  Other: { icon: <Shapes size={22} />, bg: 'var(--rejected-bg)', color: 'var(--rejected)' },
};

// ── Inline status dropdown for faculty ───────────────────────────────────────
const StatusDropdown = ({ complaintId, currentStatus, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const dropRef = useRef(null);
  const allowed = ['pending', 'in_progress', 'resolved', 'rejected'];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const update = async (newStatus) => {
    if (newStatus === currentStatus) { setOpen(false); return; }
    setSaving(true);
    try {
      await complaintsAPI.updateStatus(complaintId, { status: newStatus });
      toast.success('Status updated');
      onUpdated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };

  return (
    <div ref={dropRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="btn btn-ghost btn-sm"
        disabled={saving}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)',
          padding: '5px 10px', background: saving ? 'var(--gray-50)' : '#fff',
        }}
      >
        <StatusBadge status={currentStatus} />
        <ChevronDown size={12} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 100,
          background: '#fff', border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
          minWidth: 160, padding: '4px 0', animation: 'fadeIn .15s ease',
        }}>
          {allowed.map(s => (
            <button
              key={s}
              onClick={() => update(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', textAlign: 'left',
                padding: '9px 14px', background: 'none', border: 'none',
                fontSize: '.82rem', cursor: 'pointer',
                fontWeight: s === currentStatus ? 700 : 400,
                color: s === currentStatus ? 'var(--primary-600)' : 'var(--gray-700)',
                transition: 'background .1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <StatusBadge status={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Faculty Dashboard ─────────────────────────────────────────────────────────
const FacultyDashboard = ({ user }) => {
  const [tab, setTab] = useState('assigned');
  const [assigned, setAssigned] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const [loadingA, setLoadingA] = useState(true);
  const [loadingS, setLoadingS] = useState(true);

  const fetchAssigned = useCallback(() => {
    setLoadingA(true);
    complaintsAPI.getAssignedToMe()
      .then(r => setAssigned(r.data))
      .catch(() => toast.error('Failed to load assigned complaints'))
      .finally(() => setLoadingA(false));
  }, []);

  const fetchSubmitted = useCallback(() => {
    setLoadingS(true);
    complaintsAPI.getMySubmissions()
      .then(r => setSubmitted(r.data))
      .catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoadingS(false));
  }, []);

  useEffect(() => {
    fetchAssigned();
    fetchSubmitted();
    const es = new EventSource('/api/sse/stream', { withCredentials: true });
    es.addEventListener('complaint_updated', () => { fetchAssigned(); fetchSubmitted(); });
    es.addEventListener('complaint_created', () => fetchSubmitted());
    return () => es.close();
  }, [fetchAssigned, fetchSubmitted]);

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="page-container">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="dash-header">
        <div>
          <h1 className="page-title">Faculty Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user.name}</strong>
            {user.department && <> &middot; {user.department}</>}
            {user.faculty_role && <> &middot; {user.faculty_role}</>}
          </p>
        </div>
        <Link to="/submit-complaint" className="btn btn-primary">
          <PlusCircle size={16} /> New Complaint
        </Link>
      </div>



      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="tab-strip">
        {[
          { id: 'assigned', label: 'Assigned to Me', icon: <ClipboardList size={15} />, count: assigned.length },
          { id: 'submitted', label: 'My Submissions', icon: <Send size={15} />, count: submitted.length },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tab-btn ${tab === t.id ? 'tab-btn--active' : ''}`}
          >
            {t.icon}
            <span>{t.label}</span>
            <span className={`tab-badge ${tab === t.id ? 'tab-badge--active' : ''}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Assigned to Me ─────────────────────────────────────────────── */}
      {tab === 'assigned' && (
        <div className="card">
          <div className="card-section-header">
            <h3 className="card-section-title">Assigned Complaints</h3>
          </div>
          {loadingA ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : assigned.length === 0 ? (
            <div className="empty-state" style={{ padding: '60px 20px' }}>
              <h3>No complaints assigned yet</h3>
              <p>The admin will assign complaints to you soon</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Submitted By</th>
                    <th>Category</th>
                    <th>Assigned On</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assigned.map(c => (
                    <tr key={c.id}>
                      <td className="id-cell">#{c.id}</td>
                      <td>
                        <Link to={`/complaint/${c.id}`} className="table-link">{c.title}</Link>
                      </td>
                      <td>
                        <div className="user-cell">
                          <span className="user-cell__name">{c.user_name}</span>
                          <span className="user-cell__email">{c.user_email}</span>
                        </div>
                      </td>
                      <td><span className="cat-badge">{c.category}</span></td>
                      <td className="date-cell">{c.assigned_at ? fmt(c.assigned_at) : fmt(c.updated_at)}</td>
                      <td>
                        <StatusDropdown complaintId={c.id} currentStatus={c.status} onUpdated={fetchAssigned} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── My Submissions ─────────────────────────────────────────────── */}
      {tab === 'submitted' && (
        <div className="card">
          <div className="card-section-header">
            <h3 className="card-section-title">My Submitted Complaints</h3>
          </div>
          {loadingS ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : submitted.length === 0 ? (
            <div className="empty-state" style={{ padding: '60px 20px' }}>
              <Send size={40} style={{ color: 'var(--gray-300)', margin: '0 auto 12px' }} />
              <h3>No submissions yet</h3>
              <Link to="/submit-complaint" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                <PlusCircle size={14} /> Submit a Complaint
              </Link>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Submitted</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submitted.map(c => (
                    <tr key={c.id}>
                      <td className="id-cell">#{c.id}</td>
                      <td>
                        <Link to={`/complaint/${c.id}`} className="table-link">{c.title}</Link>
                      </td>
                      <td><span className="cat-badge">{c.category}</span></td>
                      <td className="date-cell">{fmt(c.created_at)}</td>
                      <td>
                        {c.assigned_name
                          ? <span className="assignee-name">{c.assigned_name}</span>
                          : <span className="unassigned-label">Unassigned</span>
                        }
                      </td>
                      <td><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Student Dashboard ─────────────────────────────────────────────────────────
const StudentDashboard = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    complaintsAPI.getAll()
      .then(r => setComplaints(r.data))
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
    const es = new EventSource('/api/sse/stream', { withCredentials: true });
    es.addEventListener('complaint_updated', fetchData);
    es.addEventListener('complaint_created', fetchData);
    return () => es.close();
  }, [fetchData]);

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const in_progress = complaints.filter(c => c.status === 'in_progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const recent = complaints.slice(0, 6);

  const categories = Object.keys(CATEGORY_MAP);
  const categoryCards = categories
    .map(cat => ({ cat, count: complaints.filter(c => c.category === cat).length, ...CATEGORY_MAP[cat] }))
    .filter(c => c.count > 0);
  const displayCards = categoryCards.length > 0
    ? categoryCards
    : categories.slice(0, 4).map(cat => ({ cat, count: 0, ...CATEGORY_MAP[cat] }));

  const fmt = d => new Date(d).toLocaleDateString();

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: 72, borderRadius: 12, marginBottom: 28 }} />
        <div className="stats-grid stats-grid-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 96, borderRadius: 16 }} />)}
        </div>
        <div className="dash-content-grid">
          <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="dash-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back, <strong>{user.name}</strong></p>
        </div>
        <Link to="/submit-complaint" className="btn btn-primary">
          <PlusCircle size={16} /> New Complaint
        </Link>
      </div>



      {/* ── Content grid ───────────────────────────────────────────────── */}
      <div className="dash-content-grid">
        {/* Categories card */}
        <div className="card">
          <div className="card-section-header">
            <h3 className="card-section-title">Categories</h3>
          </div>
          <div className="card-pad">
            <ul className="category-list">
              {displayCards.map(c => (
                <li key={c.cat} className="category-item">
                  <div className="category-icon" style={{ background: c.bg, color: c.color }}>
                    {c.icon}
                  </div>
                  <div>
                    <div className="category-name">{c.cat}</div>
                    <div className="category-count">{c.count} complaint{c.count !== 1 ? 's' : ''}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent complaints card */}
        <div className="card">
          <div className="card-section-header">
            <h3 className="card-section-title">Recent Complaints</h3>
            <Link to="/my-complaints" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/complaint/${c.id}`} className="table-link">{c.title}</Link>
                    </td>
                    <td><span className="cat-badge">{c.category}</span></td>
                    <td className="date-cell">{fmt(c.created_at)}</td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '48px 20px' }}>
                      <StickyNote size={36} style={{ color: 'var(--gray-300)', margin: '0 auto 10px' }} />
                      <p style={{ color: 'var(--gray-500)', marginBottom: 14 }}>No complaints yet</p>
                      <Link to="/submit-complaint" className="btn btn-primary btn-sm">Submit One</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Root: route by role ───────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'faculty' ? <FacultyDashboard user={user} /> : <StudentDashboard user={user} />;
};

export default Dashboard;
