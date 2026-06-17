import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { User, Mail, Lock, Eye, EyeOff, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName]       = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const resolveMedia = (p) => {
    if (!p) return null;
    if (p.startsWith('http')) return p;
    const api = import.meta.env.VITE_API_URL || '/api';
    const base = api.startsWith('http') ? api.replace(/\/api\/?$/, '') : window.location.origin;
    return `${base}${p}`;
  };

  const [preview, setPreview]       = useState(user?.avatar ? resolveMedia(user.avatar) : null);
  const fileRef = useRef();

  const roleColor = { admin: 'var(--rejected)', faculty: 'var(--secondary-500)', student: 'var(--primary-600)' };
  const roleLabel = { admin: 'Administrator', faculty: 'Faculty Member', student: 'Student' };

  const handleAvatarChange = e => {
    const f = e.target.files[0];
    if (f) {
      setAvatarFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (password && password !== confirm) {
      return toast.error('Passwords do not match');
    }
    if (password && password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const fd = new FormData();
      if (name.trim() !== user.name) fd.append('name', name.trim());
      if (password) fd.append('password', password);
      if (avatarFile) fd.append('avatar', avatarFile);

      if ([...fd.entries()].length === 0) {
        toast('No changes to save.', { icon: 'ℹ️' });
        return;
      }

      const { data } = await usersAPI.updateProfile(fd);
      updateUser(data);
      toast.success('Profile updated successfully!');
      setPassword(''); setConfirm('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      <div className="profile-grid">
        {/* Avatar Card */}
        <div className="card card-pad" style={{ textAlign: 'center', alignSelf: 'start' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            <div style={{
              width: '100px', height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: 800, color: '#fff',
              overflow: 'hidden', margin: '0 auto',
              boxShadow: '0 8px 24px rgba(99,102,241,.3)',
            }}>
              {preview
                ? <img src={preview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              style={{
                position: 'absolute', bottom: 2, right: 2,
                width: '28px', height: '28px',
                background: 'var(--primary-600)', color: '#fff',
                border: '2px solid #fff', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Camera size={13} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </div>

          <h2 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{user?.name}</h2>
          <span style={{
            display: 'inline-block', padding: '3px 12px', borderRadius: 'var(--radius-full)',
            background: 'var(--primary-50)', color: roleColor[user?.role], fontWeight: 700,
            fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.04em',
          }}>
            {roleLabel[user?.role]}
          </span>

          {user.role === 'faculty' && (
            <div style={{ marginTop: '12px', fontSize: '.85rem', fontWeight: 600, color: 'var(--primary-600)' }}>
              {user.faculty_role} @ {user.department}
            </div>
          )}

          {user.role === 'student' && (
            <div style={{ marginTop: '12px', textAlign: 'left', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)' }}>
              <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '4px' }}>Academic Info</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '.7rem', color: 'var(--gray-400)' }}>Dept</div>
                  <div style={{ fontSize: '.8rem', fontWeight: 600 }}>{user.department}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.7rem', color: 'var(--gray-400)' }}>Batch</div>
                  <div style={{ fontSize: '.8rem', fontWeight: 600 }}>{user.batch}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.7rem', color: 'var(--gray-400)' }}>Class</div>
                  <div style={{ fontSize: '.8rem', fontWeight: 600 }}>{user.class}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.7rem', color: 'var(--gray-400)' }}>Roll No</div>
                  <div style={{ fontSize: '.8rem', fontWeight: 600 }}>{user.roll_no}</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--gray-100)', fontSize: '.8rem', color: 'var(--gray-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              <Mail size={13} /> {user?.email}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card card-pad">
          <h3 style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '20px' }}>Edit Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon-left" />
                <input type="text" className="form-input input-with-icon-left"
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon-left" />
                <input type="email" className="form-input input-with-icon-left"
                  value={user?.email} disabled
                  style={{ background: 'var(--gray-50)', color: 'var(--gray-400)' }} />
              </div>
              <span className="form-hint">Email cannot be changed</span>
            </div>

            <div style={{ height: '1px', background: 'var(--gray-100)', margin: '16px 0' }} />
            <h4 style={{ fontWeight: 600, color: 'var(--gray-700)', marginBottom: '16px', fontSize: '.9rem' }}>Change Password</h4>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon-left" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-input input-with-icon-left input-with-icon-right"
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className="input-icon-right" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon-left" />
                <input
                  type="password"
                  className="form-input input-with-icon-left"
                  placeholder="Re-enter new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : <><Save size={15} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;


