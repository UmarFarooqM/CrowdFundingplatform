import React from 'react';

const ProgressBar = ({ current, goal, className = '' }) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
      <div
        className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;