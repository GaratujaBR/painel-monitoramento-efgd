import React from 'react';
import PropTypes from 'prop-types';
import '../../shared/StatusCard.css';
import './StatusCardColors.css';

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
