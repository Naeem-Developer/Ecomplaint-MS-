import React from 'react';

const DOT = { pending: 'â—', in_progress: 'â—', resolved: 'â—', rejected: 'â—' };
const LABEL = {
  pending:     'Pending',
  in_progress: 'In Progress',
  resolved:    'Resolved',
  rejected:    'Rejected',
};

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>
    {DOT[status]} {LABEL[status] || status}
  </span>
);

export default StatusBadge;
