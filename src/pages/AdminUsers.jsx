import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, refsAPI } from '../services/api';
import {
  Search, Users, Shield, BookOpen, GraduationCap,
  Plus, Trash2, X, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_ICON  = { admin: <Shield size={14} />, faculty: <BookOpen size={14} />, student: <GraduationCap size={14} /> };
const ROLE_COLOR = { admin: 'var(--rejected)', faculty: 'var(--secondary-500)', student: 'var(--primary-600)' };
const ROLE_BG    = { admin: 'var(--rejected-bg)', faculty: 'var(--in_progress-bg)', student: 'var(--primary-50)' };

const DEPARTMENTS_DATA = {
  "Arts & Humanities": ["English Language & Literature", "History", "Philosophy", "Linguistics", "Fine Arts / Visual Arts", "Music", "Theatre & Performing Arts", "Film Studies", "Comparative Literature", "Religious Studies", "Classical Studies", "Cultural Studies"],
  "Natural Sciences": ["Physics", "Chemistry", "Biology", "Botany", "Zoology", "Geology / Earth Sciences", "Environmental Science", "Astronomy & Astrophysics", "Biochemistry", "Microbiology", "Genetics", "Marine Science", "Atmospheric Science / Meteorology"],
  "Technology & Computing": ["Computer Science", "Software Engineering", "Information Technology", "Cybersecurity", "Artificial Intelligence & ML", "Data Science", "Network Engineering", "Human-Computer Interaction"],
  "Engineering": ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Chemical Engineering", "Aerospace Engineering", "Biomedical Engineering", "Environmental Engineering", "Industrial Engineering", "Materials Science", "Structural Engineering", "Petroleum Engineering", "Nuclear Engineering", "Robotics Engineering", "Mechatronics"],
  "Medical & Health Sciences": ["Medicine (MBBS / MD)", "Nursing", "Pharmacy", "Dentistry", "Physiotherapy", "Public Health", "Nutrition & Dietetics", "Optometry", "Radiology", "Occupational Therapy", "Veterinary Medicine", "Psychiatry & Mental Health", "Biomedical Sciences"],
  "Social Sciences": ["Psychology", "Sociology", "Anthropology", "Political Science", "Economics", "Geography", "Archaeology", "Communication & Media Studies", "Social Work", "Criminology", "International Relations", "Urban Studies"],
  "Business & Management": ["Business Administration (BBA/MBA)", "Accounting & Finance", "Marketing", "Human Resource Management", "Supply Chain & Logistics", "Entrepreneurship", "International Business", "Banking & Insurance", "Operations Management"],
  "Law & Governance": ["Law / Jurisprudence", "Constitutional Law", "International Law", "Criminology & Criminal Justice", "Public Administration", "Policy Studies"],
  "Languages & Linguistics": ["Arabic", "French", "German", "Spanish", "Chinese (Mandarin)", "Urdu / Persian", "Japanese / Korean", "Translation & Interpretation"],
  "Design & Architecture": ["Architecture", "Urban & Regional Planning", "Interior Design", "Graphic Design", "Fashion Design", "Industrial Design", "Landscape Architecture"],
  "Agriculture & Life Sciences": ["Agriculture", "Agronomy", "Horticulture", "Food Science", "Animal Husbandry", "Agricultural Economics", "Fisheries & Aquaculture", "Forestry"],
  "Education": ["Education & Teacher Training", "Special Education", "Early Childhood Education", "Educational Psychology", "Curriculum & Instruction", "Physical Education"],
  "Islamic & Religious Studies": ["Islamic Studies", "Quranic Sciences", "Hadith Studies", "Islamic Jurisprudence (Fiqh)", "Comparative Religion"],
  "Interdisciplinary Fields": ["Biotechnology", "Nanotechnology", "Energy Studies", "Cognitive Science", "Neuroscience", "Space Science", "Forensic Science", "Digital Humanities", "Health Informatics", "Bioinformatics"]
};

// Flatten for datalist
const ALL_DEPTS = Object.values(DEPARTMENTS_DATA).flat();

// ── Free-text + datalist combo ────────────────────────────────────────────────
const DatalistInput = ({ id, value, onChange, placeholder, options, required }) => (
  <div style={{ position: 'relative' }}>
    <input
      list={id + '-list'}
      className="form-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete="off"
    />
    <datalist id={id + '-list'}>
      {options.map(o => <option key={o} value={o} />)}
    </datalist>
  </div>
);

// ── Add/Create Faculty Modal ──────────────────────────────────────────────────
const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'faculty',
    department: '', faculty_role: '',
  });
  const [deptOptions, setDeptOptions]   = useState([]);
  const [roleOptions, setRoleOptions]   = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    refsAPI.getDepartments()
      .then(r => {
        const dbDepts = r.data.map(d => d.name);
        // Merge hardcoded + DB depts, unique
        const combined = Array.from(new Set([...ALL_DEPTS, ...dbDepts]));
        setDeptOptions(combined);
      })
      .catch(() => setDeptOptions(ALL_DEPTS));
    
    refsAPI.getRoles().then(r => setRoleOptions(r.data.map(d => d.name))).catch(() => {});
  }, [isOpen]);

  const reset = () => setForm({ name: '', email: '', password: '', role: 'faculty', department: '', faculty_role: '' });

  if (!isOpen) return null;

  const { user: currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser?.role !== 'admin') {
      toast.error('You are not authorized to create users');
      return;
    }
    if (form.role === 'faculty' && (!form.department.trim() || !form.faculty_role.trim())) {
      return toast.error('Department and position are required for faculty');
    }
    setSaving(true);
    try {
      await usersAPI.create(form);
      toast.success('User created successfully');
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Create user failed', err);
      if (err.status === 401) {
        toast.error('Unauthorized — please login as an admin');
      } else {
        toast.error(err.message);
      }
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New User</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input type="email" className="form-input" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input type="password" className="form-input" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          {/* User Type */}
          <div className="form-group">
            <label className="form-label">User Type *</label>
            <select className="form-select" value="faculty" disabled>
              <option value="faculty">Faculty</option>
            </select>
          </div>


              {/* Department — free-text with DB-backed suggestions */}
              <div className="form-group">
                <label className="form-label">Department *</label>
                <DatalistInput
                  id="dept"
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g. Computer Science, Electrical…"
                  options={deptOptions}
                  required
                />
                <span className="form-hint">Type a new department or choose from the list</span>
              </div>
              {/* Position/Role — free-text with DB-backed suggestions */}
              <div className="form-group">
                <label className="form-label">Position / Role *</label>
                <DatalistInput
                  id="pos"
                  value={form.faculty_role}
                  onChange={e => setForm({ ...form, faculty_role: e.target.value })}
                  placeholder="e.g. Professor, HOD, Electrician…"
                  options={roleOptions}
                  required
                />
                <span className="form-hint">Type a new position or choose from the list</span>
              </div>


          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
              {saving ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const AdminUsers = () => {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [posFilter, setPosFilter]   = useState('');
  const [deptOptions, setDeptOptions] = useState([]);
  const [posOptions, setPosOptions]   = useState([]);
  const [modalOpen, setModalOpen]   = useState(false);
  const esRef = useRef(null);

  const fetchUsers = () => {
    setLoading(true);
    usersAPI.getAll()
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  const fetchFilterOptions = () => {
    refsAPI.getDepartments().then(r => setDeptOptions(r.data.map(d => d.name))).catch(() => {});
    refsAPI.getRoles().then(r => setPosOptions(r.data.map(d => d.name))).catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
    fetchFilterOptions();

    // SSE: real-time updates when faculty are created/deleted
    const es = new EventSource('/api/sse/stream', { withCredentials: true });
    esRef.current = es;
    es.addEventListener('faculty_created', () => { fetchUsers(); fetchFilterOptions(); });
    es.addEventListener('user_deleted',    () => { fetchUsers(); });
    return () => es.close();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}? This cannot be undone.`)) return;
    try {
      await usersAPI.delete(id);
      toast.success('User removed');
      // SSE will trigger re-fetch, but do it optimistically too
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q)) ||
      (u.roll_no && u.roll_no.toLowerCase().includes(q)) ||
      (u.batch && u.batch.toLowerCase().includes(q));
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchDept = !deptFilter || u.department === deptFilter;
    const matchPos  = !posFilter  || u.faculty_role === posFilter;
    return matchSearch && matchRole && matchDept && matchPos;
  });

  const counts = {
    total:   users.length,
    admin:   users.filter(u => u.role === 'admin').length,
    faculty: users.filter(u => u.role === 'faculty').length,
    student: users.filter(u => u.role === 'student').length,
  };

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">All registered users · live updates enabled</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Add User
        </button>
      </div>

      <AddUserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchUsers} />

      {/* Stats pills */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        {[
          { label: 'Total', value: counts.total,   icon: <Users size={16} />,        bg: 'var(--primary-50)',     color: 'var(--primary-600)' },
          { label: 'Admins', value: counts.admin,  icon: <Shield size={16} />,        bg: 'var(--rejected-bg)',    color: 'var(--rejected)' },
          { label: 'Faculty', value: counts.faculty,icon: <BookOpen size={16} />,     bg: 'var(--in_progress-bg)', color: 'var(--in_progress)' },
          { label: 'Students', value: counts.student,icon: <GraduationCap size={16} />,bg: 'var(--primary-50)',   color: 'var(--primary-600)' },
        ].map(p => (
          <div key={p.label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 18px', background: '#fff',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)',
          }}>
            <span style={{ color: p.color, background: p.bg, padding: 6, borderRadius: 8, display: 'flex' }}>{p.icon}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)' }}>{p.value}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--gray-500)', fontWeight: 500 }}>{p.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="input-wrapper" style={{ flex: '1 1 200px' }}>
          <Search size={16} className="input-icon-left" />
          <input
            className="form-input input-with-icon-left"
            placeholder="Search name, email, dept…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 8px 8px 38px' }}
          />
        </div>
        <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Types</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
        <select className="form-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Departments</option>
          {deptOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="form-select" value={posFilter} onChange={e => setPosFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Positions</option>
          {posOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ marginTop: 20 }}>
        {loading ? (
          <div className="loading-center"><div className="spinner" /><p>Loading users…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: 50 }}>
            <div className="empty-state-icon">👤</div>
            <h3>No users found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Dept / Batch</th>
                  <th>Role / Academic Info</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: 'var(--gray-400)', fontWeight: 600 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg,var(--primary-500),var(--secondary-500))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: '.85rem', flexShrink: 0,
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '.875rem' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '.875rem' }}>{u.email}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '3px 10px', borderRadius: '999px',
                        background: ROLE_BG[u.role], color: ROLE_COLOR[u.role],
                        fontSize: '.75rem', fontWeight: 700, textTransform: 'capitalize',
                      }}>
                        {ROLE_ICON[u.role]} {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '.85rem', color: 'var(--gray-700)' }}>
                      {u.department || <span style={{ color: 'var(--gray-300)' }}>—</span>}
                      {u.role === 'student' && u.batch && (
                        <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', marginTop: 2 }}>
                          Batch: {u.batch}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: '.85rem', color: 'var(--gray-500)' }}>
                      {u.role === 'faculty' ? (
                        u.faculty_role
                      ) : u.role === 'student' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ color: 'var(--gray-800)', fontWeight: 600 }}>{u.class}</span>
                          <span style={{ fontSize: '.75rem' }}>Sem: {u.semester} · Roll: {u.roll_no}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--gray-300)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>{fmt(u.created_at)}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--rejected)' }}
                        onClick={() => handleDelete(u.id, u.name)}
                        title="Remove user"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
