import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { Send, Paperclip, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Academic', 'Infrastructure', 'Administration', 'Hostel', 'Library', 'Transport', 'Other'];

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: '', title: '', description: '' });
  const [file, setFile]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.category)    e.category    = 'Please select a category';
    if (!form.title.trim()) e.title      = 'Title is required';
    if (form.title.length > 255) e.title = 'Title too long (max 255 chars)';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.description.length < 20) e.description = 'Description too short (min 20 chars)';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('category', form.category);
      fd.append('title', form.title.trim());
      fd.append('description', form.description.trim());
      if (file) fd.append('file', file);

      await complaintsAPI.create(fd);
      toast.success('Complaint submitted successfully!');
      navigate('/my-complaints');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Submit a Complaint</h1>
        <p className="page-subtitle">Describe your issue and we'll look into it</p>
      </div>

      <div className="card card-pad" style={{ maxWidth: '680px' }}>
        <div className="alert alert-info" style={{ marginBottom: '20px' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>Be clear and specific. Accurate information helps resolve issues faster.</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              className={`form-select ${errors.category ? 'error' : ''}`}
              value={form.category}
              onChange={handleChange}
            >
              <option value="">-- Select a category --</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Brief summary of the issue"
              value={form.title}
              onChange={handleChange}
              maxLength={255}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
            <span className="form-hint">{form.title.length}/255</span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Provide a detailed description of your complaint..."
              value={form.description}
              onChange={handleChange}
              rows={5}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          {/* File */}
          <div className="form-group">
            <label className="form-label">Attachment (optional)</label>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px',
              border: '2px dashed var(--gray-300)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: 'var(--gray-50)',
              transition: 'var(--transition)',
              fontSize: '.875rem',
              color: 'var(--gray-500)',
            }}>
              <Paperclip size={16} />
              {file ? file.name : 'Click to attach image, PDF, or Word doc (max 5MB)'}
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={e => setFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>
            {file && (
              <button type="button" className="form-hint" style={{ cursor: 'pointer', color: 'var(--rejected)' }}
                onClick={() => setFile(null)}>
                Remove file
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : <><Send size={16} /> Submit Complaint</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;

