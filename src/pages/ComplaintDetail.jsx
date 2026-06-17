import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { ArrowLeft, Calendar, Tag, User, Paperclip, Shield, CheckCircle, Clock, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const [newStatus, setNewStatus] = useState('');
  const [adminRemark, setAdminRemark] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [facultyRemark, setFacultyRemark] = useState('');
  const [savingFacultyRemark, setSavingFacultyRemark] = useState(false);

  const resolveMedia = (p) => {
    if (!p) return null;
    if (p.startsWith('http')) return p;
    const api = import.meta.env.VITE_API_URL || '/api';
    const base = api.startsWith('http') ? api.replace(/\/api\/?$/, '') : window.location.origin;
    return `${base}${p}`;
  };

  const fetchComplaint = () => {
    complaintsAPI.getById(id)
      .then(r => {
        setComplaint(r.data);
        setNewStatus(r.data.status);
        setAdminRemark(r.data.admin_remark || '');
        if (r.data.assigned_dept) setSelectedDept(r.data.assigned_dept);
      })
      .catch(err => { toast.error(err.message); navigate(-1); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaint();
    if (currentUser?.role === 'admin') {
      usersAPI.getAll().then(r => setAllUsers(r.data)).catch(() => {});
    }
  }, [id, currentUser]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Only allow admin to update status when complaint is assigned
      if (currentUser?.role === 'admin' && !complaint.assigned_name) {
        throw new Error('Assign this complaint to a faculty member before updating status');
      }
      await complaintsAPI.updateStatus(id, { status: newStatus, admin_remark: adminRemark });
      toast.success('Status updated successfully');
      fetchComplaint();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedFaculty) return toast.error('Please select a faculty member');
    setAssigning(true);
    try {
      await complaintsAPI.assign(id, { assigned_to: selectedFaculty });
      toast.success('Complaint assigned successfully');
      fetchComplaint();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAssigning(false);
    }
  };

  const isAssignedToCurrentUser = () => {
    if (!currentUser || !complaint) return false;
    // Check common fields returned by backend: assigned_to id, assigned_email or assigned_name
    if (complaint.assigned_to && currentUser.id && complaint.assigned_to === currentUser.id) return true;
    if (complaint.assigned_email && currentUser.email && complaint.assigned_email === currentUser.email) return true;
    if (complaint.assigned_name && currentUser.name && complaint.assigned_name === currentUser.name) return true;
    return false;
  };

  const handleFacultyRemark = async (e) => {
    e.preventDefault();
    if (!facultyRemark.trim()) return toast.error('Enter a remark');
    setSavingFacultyRemark(true);
    try {
      // Backend should accept faculty_remark; if not, adapt backend accordingly.
      await complaintsAPI.updateStatus(id, { faculty_remark: facultyRemark });
      toast.success('Remark submitted');
      setFacultyRemark('');
      fetchComplaint();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingFacultyRemark(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!complaint) return null;

  const isAdmin = currentUser?.role === 'admin';
  const formatted = new Date(complaint.created_at).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const departments = [...new Set(allUsers.filter(u => u.role === 'faculty').map(u => u.department))];
  const facultyInDept = allUsers.filter(u => u.role === 'faculty' && u.department === selectedDept);

  return (
    <div className="page-container">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}>
        <ArrowLeft size={15} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '2fr 1fr' : '1fr', gap: '24px' }}>
        <div className="card card-pad">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <span className="complaint-cat-badge"><Tag size={11} /> {complaint.category}</span>
            <StatusBadge status={complaint.status} />
          </div>

          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>
            {complaint.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '.8rem', color: 'var(--gray-400)' }}>
              <User size={13} /> {complaint.user_name}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '.8rem', color: 'var(--gray-400)' }}>
              <Calendar size={13} /> {formatted}
            </span>
            <span style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>ID: #{complaint.id}</span>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '20px' }}>
            <h3 style={{ fontWeight: 600, color: 'var(--gray-700)', marginBottom: '10px', fontSize: '.9rem', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Description
            </h3>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
              {complaint.description}
            </p>
          </div>

          {complaint.file_url && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--gray-100)' }}>
              <h3 style={{ fontWeight: 600, color: 'var(--gray-700)', marginBottom: '10px', fontSize: '.9rem', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Attachment
              </h3>
                  <a href={resolveMedia(complaint.file_url)} target="_blank" rel="noreferrer"
                    className="btn btn-outline btn-sm">
                <Paperclip size={14} /> View Attachment
              </a>
            </div>
          )}

          {complaint.assigned_name && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--gray-100)' }}>
              <h3 style={{ fontWeight: 600, color: 'var(--gray-700)', marginBottom: '10px', fontSize: '.9rem', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Assigned To
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--secondary-100)', color: 'var(--secondary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.8rem' }}>
                    {complaint.assigned_name.charAt(0)}
                 </div>
                 <div>
                    <div style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--gray-800)' }}>{complaint.assigned_name}</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--gray-500)' }}>{complaint.assigned_role} · {complaint.assigned_dept}</div>
                 </div>
              </div>
            </div>
          )}

          {complaint.admin_remark && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--primary-700)', marginBottom: '6px', fontSize: '.875rem' }}>
                Admin Remark
              </h3>
              <p style={{ color: 'var(--primary-800)', fontSize: '.875rem', lineHeight: 1.6 }}>
                {complaint.admin_remark}
              </p>
            </div>
          )}

          {complaint.faculty_remark && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--in_progress-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '6px', fontSize: '.875rem' }}>
                Faculty Remark
              </h3>
              <p style={{ color: 'var(--gray-700)', fontSize: '.875rem', lineHeight: 1.6 }}>
                {complaint.faculty_remark}
              </p>
              <div style={{ marginTop: 8, fontSize: '.8rem', color: 'var(--gray-500)' }}>
                — {complaint.faculty_remark_by?.name || complaint.assigned_name || 'Faculty'}
                {complaint.faculty_remark_by?.role || complaint.assigned_role ? ` · ${complaint.faculty_remark_by?.role || complaint.assigned_role}` : ''}
                {complaint.faculty_remark_by?.department ? ` · ${complaint.faculty_remark_by.department}` : ''}
              </div>
            </div>
          )}
          {/* Faculty remark form for the assigned faculty member */}
          {currentUser?.role === 'faculty' && isAssignedToCurrentUser() && (
            <div className="card card-pad" style={{ marginTop: 16 }}>
              <h4 style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>Add Remark</h4>
              <form onSubmit={handleFacultyRemark}>
                <div className="form-group">
                  <textarea className="form-textarea" rows={4} value={facultyRemark} onChange={e => setFacultyRemark(e.target.value)} placeholder="Add your remark about this complaint" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={savingFacultyRemark}>
                    {savingFacultyRemark ? 'Saving...' : 'Submit Remark'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Status Update */}
            <div className="card card-pad">
              <h3 style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="var(--primary-600)" /> Update Status
              </h3>
              <form onSubmit={handleUpdateStatus}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Admin Remark</label>
                  <textarea className="form-textarea" rows={3} value={adminRemark} onChange={e => setAdminRemark(e.target.value)} placeholder="Add a remark..." />
                </div>
                {currentUser?.role === 'admin' && !complaint.assigned_name && (
                  <div style={{ color: 'var(--gray-500)', marginBottom: 8 }}>
                    Assign this complaint to a faculty member before updating its status.
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-full" disabled={updating || (currentUser?.role === 'admin' && !complaint.assigned_name)}>
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </form>
            </div>

            {/* Assignment */}
            <div className="card card-pad">
              <h3 style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} color="var(--secondary-600)" /> Assign Faculty
              </h3>
              <form onSubmit={handleAssign}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select" value={selectedDept} onChange={e => { setSelectedDept(e.target.value); setSelectedFaculty(''); }}>
                    <option value="">-- Select Department --</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Faculty Member</label>
                  <select className="form-select" value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)} disabled={!selectedDept}>
                    <option value="">-- Select Faculty --</option>
                    {facultyInDept.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.faculty_role})</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-outline w-full" disabled={assigning || !selectedFaculty} style={{ borderColor: 'var(--secondary-500)', color: 'var(--secondary-600)' }}>
                  {assigning ? 'Assigning...' : 'Assign to Faculty'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetail;
