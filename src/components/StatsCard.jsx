import React from 'react';

/**
 * StatsCard â€” used in admin/user dashboards
 * @param {ReactNode} icon
 * @param {string} label
 * @param {number|string} value
 * @param {string} iconBg  â€” CSS background for icon box
 * @param {string} iconColor â€” CSS color for icon
 */
const StatsCard = ({ icon, label, value, iconBg, iconColor }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: iconBg || 'var(--primary-50)' }}>
      <span style={{ color: iconColor || 'var(--primary-600)' }}>{icon}</span>
    </div>
    <div className="stat-info">
      <div className="stat-value">{value ?? 'â€”'}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default StatsCard;
