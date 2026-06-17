import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, Trash, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint, onDelete, showUser = false }) => {
  const navigate = useNavigate();

  const formatted = new Date(complaint.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="card complaint-card">
      <div className="complaint-card-header">
        <span className="complaint-cat-badge">
          <Tag size={11} /> {complaint.category}
        </span>
        <StatusBadge status={complaint.status} />
      </div>

      <h3 className="complaint-title">{complaint.title}</h3>
      <p className="complaint-desc">{complaint.description}</p>

      {complaint.admin_remark && (
        <div className="complaint-remark">
          <strong>Admin remark:</strong> {complaint.admin_remark}
        </div>
      )}

      {showUser && complaint.user_name && (
        <div className="complaint-meta-user">
          <span>By: <strong>{complaint.user_name}</strong></span>
          <span style={{ color: 'var(--gray-400)' }}>Â·</span>
          <span style={{ textTransform: 'capitalize', color: 'var(--secondary-600)' }}>
            {complaint.user_role}
          </span>
        </div>
      )}

      <div className="complaint-card-footer">
        <span className="complaint-date"><Calendar size={12} /> {formatted}</span>
        <div className="complaint-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/complaint/${complaint.id}`)}
            title="View Details"
          >
            <Eye size={14} />
          </button>
          {onDelete && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onDelete(complaint.id)}
              title="Delete"
              style={{ color: 'var(--rejected)' }}
            >
              <Trash size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
