import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { complaintsAPI, usersAPI, refsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Search, Eye, CheckCircle, X, UserPlus, User } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES   = ['', 'pending', 'assigned', 'in_progress', 'resolved', 'rejected'];
const CATEGORIES = ['', 'Academic', 'Infrastructure', 'Administration', 'Hostel', 'Library', 'Transport', 'Other'];

// ── Assign Faculty Modal ──────────────────────────────────────────────────────
const AssignModal = ({ complaint, onClose, onAssigned }) => {
  const [faculty, setFaculty]         = useState([]);
  const [search, setSearch]           = useState('');
  const [deptFilter, setDeptFilter]   = useState('');
  const [roleFilter, setRoleFilter]   = useState('');
  const [deptOptions, setDeptOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selected, setSelected]       = useState(null);
  const [assigning, setAssigning]     = useState(false);
  const [loading, setLoading]         = useState(true);

  const fetchFaculty = () => {
    setLoading(true);
    const params = {};
    if (search)     params.search       = search;
    if (deptFilter) params.department   = deptFilter;
    if (roleFilter) params.faculty_role = roleFilter;
    usersAPI.getFaculty(params)
      .then(r => setFaculty(r.data))
      .catch(() => toast.error('Failed to load faculty'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refsAPI.getDepartments().then(r => setDeptOptions(r.data.map(d => d.name))).catch(() => {});
    refsAPI.getRoles().then(r => setRoleOptions(r.data.map(d => d.name))).catch(() => {});
  }, []);

  useEffect(() => { fetchFaculty(); }, [search, deptFilter, roleFilter]);

  const handleAssign = async () => {
    if (!selected) return toast.error('Select a faculty member first');
    setAssigning(true);
    try {
      await complaintsAPI.assign(complaint.id, { assigned_to: selected.id });
      toast.success(`Assigned to ${selected.name}`);
      onAssigned();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Assign Complaint #{complaint.id}</h2>
            <p style={{ fontSize: '.8rem', color: 'var(--gray-500)', marginTop: 2 }}>{complaint.title}</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div className="input-wrapper" style={{ flex: '1 1 160px' }}>
            <Search size={14} className="input-icon-left" />
            <input
              className="form-input input-with-icon-left"
              placeholder="Search faculty…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 8px 8px 34px', fontSize: '.85rem' }}
            />
          </div>
          <select className="form-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            style={{ width: 'auto', fontSize: '.85rem', padding: '7px 10px' }}>
            <option value="">All Depts</option>
            {deptOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            style={{ width: 'auto', fontSize: '.85rem', padding: '7px 10px' }}>
            <option value="">All Positions</option>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Faculty list */}
        <div style={{ maxHeight: 300, overflowY: 'auto', padding: '12px 24px' }}>
          {loading ? (
            <div className="loading-center" style={{ padding: 20 }}><div className="spinner" /></div>
          ) : faculty.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 20 }}>No faculty found</p>
          ) : faculty.map(f => (
            <div
              key={f.id}
              onClick={() => setSelected(f)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', marginBottom: 4,
                background: selected?.id === f.id ? 'var(--primary-50)' : 'transparent',
                border: `2px solid ${selected?.id === f.id ? 'var(--primary-400)' : 'transparent'}`,
                transition: 'all .15s',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,var(--primary-500),var(--secondary-500))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '.85rem',
              }}>
                {f.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '.875rem', color: 'var(--gray-800)' }}>{f.name}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--gray-500)' }}>
                  {f.faculty_role} · {f.department}
                </div>
              </div>
              {selected?.id === f.id && (
                <CheckCircle size={18} color="var(--primary-600)" />
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAssign} disabled={assigning || !selected}>
            <UserPlus size={15} /> {assigning ? 'Assigning…' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Status Update Modal ───────────────────────────────────────────────────────
const UpdateModal = ({ complaint, onClose, onUpdated }) => {
  const [newStatus, setNewStatus] = useState(complaint.status);
  const [remark, setRemark]       = useState(complaint.admin_remark || '');
  const [saving, setSaving]       = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await complaintsAPI.updateStatus(complaint.id, { status: newStatus, admin_remark: remark });
      toast.success('Complaint updated');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Update Complaint #{complaint.id}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ padding: 24 }}>
          <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginBottom: 4 }}>{complaint.title}</p>
          <p style={{ color: 'var(--gray-500)', fontSize: '.85rem', marginBottom: 20 }}>
            By <strong>{complaint.user_name}</strong> ({complaint.user_role})
          </p>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              {STATUSES.filter(Boolean).map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Admin Remark (optional)</label>
            <textarea className="form-textarea" rows={3} value={remark}
              onChange={e => setRemark(e.target.value)}
              placeholder="Add a note for the submitter…" />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
              <CheckCircle size={15} /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const AdminComplaints = () => {
  const [searchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [status,   setStatus]       = useState('');
  const [category, setCategory]     = useState(searchParams.get('category') || '');
  const [search,   setSearch]       = useState('');
  const [updateModal, setUpdateModal] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const esRef = useRef(null);

  const fetchComplaints = () => {
    setLoading(true);
    const params = {};
    if (status)   params.status   = status;
    if (category) params.category = category;
    complaintsAPI.getAll(params)
      .then(r => setComplaints(r.data))
      .catch(() => toast.error('Failed to load complaints'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
    const es = new EventSource('/api/sse/stream', { withCredentials: true });
    esRef.current = es;
    es.addEventListener('complaint_updated', () => fetchComplaints());
    es.addEventListener('complaint_created', () => fetchComplaints());
    es.addEventListener('complaint_deleted', () => fetchComplaints());
    return () => es.close();
  }, []);

  useEffect(() => { fetchComplaints(); }, [status, category]);

  const filtered = complaints.filter(c =>
    !search ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user_email?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Complaints</h1>
        <p className="page-subtitle">
          {category
            ? <><strong>{category}</strong> · <button style={{ background:'none',border:'none',color:'var(--primary-600)',cursor:'pointer',fontWeight:600,padding:0 }} onClick={() => setCategory('')}>Clear</button></>
            : 'Manage, update and assign complaints · live updates enabled'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="input-wrapper" style={{ flex: '1 1 200px' }}>
          <Search size={16} className="input-icon-left" />
          <input
            className="form-input input-with-icon-left"
            placeholder="Search by title, user name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 8px 8px 38px' }}
          />
        </div>
        <select className="form-select" value={status} onChange={e => setStatus(e.target.value)} style={{ width: 'auto' }}>
          {STATUSES.map(s => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All Statuses'}</option>)}
        </select>
        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} style={{ width: 'auto' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ marginTop: 20 }}>
        {loading ? (
          <div className="loading-center"><div className="spinner" /><p>Loading…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: 50 }}>
            <div className="empty-state-icon">📋</div>
            <h3>No complaints found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Submitted By</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--gray-400)', fontWeight: 600 }}>#{c.id}</td>
                    <td>
                      <span style={{
                        fontWeight: 600, color: 'var(--gray-800)',
                        display: 'block', maxWidth: 200,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {c.title}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '.78rem', fontWeight: 600,
                        color: 'var(--primary-600)', background: 'var(--primary-50)',
                        padding: '2px 8px', borderRadius: '999px',
                      }}>
                        {c.category}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: '.875rem' }}>{c.user_name}</p>
                        <p style={{ color: 'var(--gray-400)', fontSize: '.75rem' }}>{c.user_email}</p>
                      </div>
                    </td>
                    <td>
                      {c.assigned_name ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                            background: 'var(--secondary-500)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '.7rem',
                          }}>
                            {c.assigned_name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: '.8rem', fontWeight: 600 }}>{c.assigned_name}</div>
                            <div style={{ fontSize: '.7rem', color: 'var(--gray-400)' }}>{c.assigned_role}</div>
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '.8rem', color: 'var(--gray-300)' }}>Unassigned</span>
                      )}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>{fmt(c.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => setUpdateModal(c)} title="Update status">
                          <Eye size={13} /> Update
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setAssignModal(c)}
                          title="Assign to faculty"
                          style={{ borderColor: 'var(--secondary-500)', color: 'var(--secondary-600)' }}
                        >
                          <UserPlus size={13} /> Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {updateModal && (
        <UpdateModal
          complaint={updateModal}
          onClose={() => setUpdateModal(null)}
          onUpdated={fetchComplaints}
        />
      )}
      {assignModal && (
        <AssignModal
          complaint={assignModal}
          onClose={() => setAssignModal(null)}
          onAssigned={fetchComplaints}
        />
      )}
    </div>
  );
};

export default AdminComplaints;
