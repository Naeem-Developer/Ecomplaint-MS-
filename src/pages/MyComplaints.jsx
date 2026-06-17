import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import { PlusCircle, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['', 'pending', 'in_progress', 'resolved', 'rejected'];
const CATEGORIES = ['', 'Academic', 'Infrastructure', 'Administration', 'Hostel', 'Library', 'Transport', 'Other'];

const MyComplaints = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState('');

  const fetchComplaints = () => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (category) params.category = category;
    complaintsAPI.getAll(params)
      .then(r => setComplaints(r.data))
      .catch(() => toast.error('Failed to load complaints'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, [status, category]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await complaintsAPI.delete(id);
      toast.success('Complaint deleted');
      fetchComplaints();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = complaints.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">My Complaints</h1>
          <p className="page-subtitle">
            {category
              ? <>Filtered by <strong>{category}</strong> · <button style={{ background: 'none', border: 'none', color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 600, padding: 0, fontSize: 'inherit' }} onClick={() => setCategory('')}>Clear filter</button></>
              : 'All your submitted complaints'
            }
          </p>
        </div>
        <Link to="/submit-complaint" className="btn btn-primary">
          <PlusCircle size={16} /> New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="input-wrapper" style={{ flex: 1, minWidth: '200px' }}>
          <Search size={16} className="input-icon-left" />
          <input
            type="text"
            className="form-input input-with-icon-left"
            placeholder="Search complaints..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 8px 8px 38px' }}
          />
        </div>
        <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}
          style={{ width: 'auto' }}>
          {STATUSES.map(s => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All Statuses'}</option>)}
        </select>
        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}
          style={{ width: 'auto' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><p>Loading...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card card-pad">
          <h3>No complaints found</h3>
          <p>Try adjusting your filters or submit a new complaint</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '12px', color: 'var(--gray-500)', fontSize: '.85rem' }}>
            Showing {filtered.length} complaint{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="complaints-grid">
            {filtered.map(c => (
              <ComplaintCard key={c.id} complaint={c} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyComplaints;


