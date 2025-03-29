import React from 'react';
import './Charts.css';

// This is a placeholder component for a progress chart
// In a real implementation, we would use a charting library like Chart.js or Recharts
const ProgressChart = ({ initiatives }) => {
  // Sort initiatives by progress
  const sortedInitiatives = [...initiatives].sort((a, b) => b.progress - a.progress);
  
  return (
    <div className="progress-chart">
      {sortedInitiatives.map(initiative => (
        <div key={initiative.id} className="progress-bar-container">
          <div className="progress-bar-label">
            <span className="initiative-name">{initiative.name}</span>
            <span className="initiative-progress-value">{initiative.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${initiative.progress}%`,
                backgroundColor: getProgressColor(initiative.progress)
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to determine color based on progress
const getProgressColor = (progress) => {
  if (progress < 25) return '#FF0000'; // Red
  if (progress < 50) return '#FFD000'; // Yellow
  if (progress < 75) return '#183EFF'; // Blue
  return '#00D000'; // Green
};

export default ProgressChart;
