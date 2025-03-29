import React from 'react';
import './StatusCard.css';

const StatusCard = ({ title, value, icon, color }) => {
  return (
    <div className={`status-card status-card-${color}`}>
      <div className="status-card-icon">
        <i className={`icon ${icon}-icon`}></i>
      </div>
      <div className="status-card-content">
        <h3 className="status-card-title">{title}</h3>
        <div className="status-card-value">{value}</div>
      </div>
    </div>
  );
};

export default StatusCard;
