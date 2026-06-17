import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { FileText, Menu, Users, StickyNote, Building, Bus, Home, ShieldCheck, Book, Wrench, Shapes, BookOpen, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/* Category → icon + colour mapping */
const CATEGORY_MAP = {
  Academic:       { icon: <Book size={24} />, bg: 'var(--primary-50)',    color: 'var(--primary-600)' },
  Infrastructure: { icon: <Wrench size={24} />,       bg: '#f0fdf4',             color: 'var(--resolved)' },
  Administration: { icon: <Building size={24} />,    bg: 'var(--in_progress-bg)',color: 'var(--in_progress)' },
  Hostel:         { icon: <Home size={24} />,    bg: 'var(--pending-bg)',   color: 'var(--pending)' },
  Library:        { icon: <BookOpen size={24} />,     bg: 'var(--primary-50)',   color: 'var(--primary-500)' },
  Transport:      { icon: <Bus size={24} />,          bg: '#fdf4ff',             color: '#a855f7' },
  Other:          { icon: <Shapes size={24} />,       bg: 'var(--rejected-bg)',  color: 'var(--rejected)' },
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintsAPI.getStats()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const totals = stats?.totals || { total: 0, pending: 0, in_progress: 0, resolved: 0, rejected: 0 };
  const byCategory = stats?.byCategory || [];
  const recent = stats?.recentActivity || [];

  /* Build per-category summary for the grid */
  const categoryCards = byCategory.map(catData => {
    const mapInfo = CATEGORY_MAP[catData.category] || { icon: <FileText size={24} />, bg: 'var(--gray-100)', color: 'var(--gray-500)' };
    return { 
        cat: catData.category, 
        count: catData.count,
        pct: totals.total > 0 ? Math.round((catData.count / totals.total) * 100) : 0,
        ...mapInfo 
    };
  });

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: '80px', borderRadius: '12px', marginBottom: '28px' }} />
        <div className="stats-grid">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '12px' }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          <div className="skeleton" style={{ height: '340px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ height: '340px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="dash-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System Overview for <strong>{user?.name}</strong>.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/complaints" className="btn btn-outline">
            <Menu size={18} strokeWidth={3} /> Manage Complaints
          </Link>
          <Link to="/admin/users" className="btn btn-primary">
            <Users size={18} strokeWidth={3} /> Users
          </Link>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <FileText size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totals.total}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--pending-bg)', color: 'var(--pending)' }}>
            <Clock size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totals.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--in_progress-bg)', color: 'var(--in_progress)' }}>
            <Wrench size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totals.in_progress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--resolved-bg)', color: 'var(--resolved)' }}>
            <ShieldCheck size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totals.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--rejected-bg)', color: 'var(--rejected)' }}>
            <XCircle size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totals.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* ── Content Grid ─────────────────────────────────── */}
      <div className="dash-content-grid">
        
        {/* Category Distribution */}
        <div className="card">
          <div className="card-pad" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--gray-100)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>Category Breakdown</h3>
          </div>
          <div className="card-pad">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {categoryCards.map(c => (
                <li key={c.cat} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '.9rem', color: 'var(--gray-800)' }}>{c.cat}</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--gray-500)' }}>{c.count} cases ({c.pct}%)</div>
                  </div>
                </li>
              ))}
              {categoryCards.length === 0 && (
                <li style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '20px' }}>
                  No cases recorded
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gray-100)', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>Recent System Activity</h3>
            <Link to="/admin/complaints" className="btn btn-outline btn-sm">View All Logs</Link>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/complaint/${c.id}`} style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
                        {c.title}
                      </Link>
                    </td>
                    <td style={{ fontSize: '.85rem' }}>{c.user_name}</td>
                    <td><span style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>{c.category}</span></td>
                    <td style={{ fontSize: '.85rem' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      <StickyNote size={32} style={{ color: 'var(--gray-300)', margin: '0 auto 12px' }} />
                      <p style={{ color: 'var(--gray-500)' }}>No recent activity</p>
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

export default AdminDashboard;
