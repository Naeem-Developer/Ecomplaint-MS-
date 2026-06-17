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
              <a href={`http://localhost:5000${complaint.file_url}`} target="_blank" rel="noreferrer"
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
                <button type="submit" className="btn btn-primary w-full" disabled={updating}>
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
