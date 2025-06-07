// src/components/LineupDisplay.js
import React from 'react';
import './LineupPreview.css';

const LineupDisplay = ({ composition }) => {
  const postes = [
    'GK', 'RB', 'CB1', 'CB2', 'LB',
    'CM1', 'CM2', 'CAM',
    'RW', 'LW', 'ST'
  ];

  return (
    <div className="terrain">
      {postes.map((poste) => (
        <div key={poste} className={`poste ${poste.toLowerCase()}`}>
          <div className="player-icon">⚽</div>
          <div className="player-name">{composition[poste] || ''}</div>
        </div>
      ))}
    </div>
  );
};

export default LineupDisplay;
