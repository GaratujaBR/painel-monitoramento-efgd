import React from 'react';
import './StatusCard.css';

const StatusCard = ({ title, value, type, onClick }) => {
  return (
    <button 
      className={`status-card ${type || 'total'}`}
      onClick={onClick}
    >
      <div className="status-card-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </button>
  );
};

export default StatusCard;
