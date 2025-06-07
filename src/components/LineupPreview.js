// src/components/LineupPreview.js
import React from 'react';
import './LineupPreview.css';

const postes = [
  { key: 'gk', label: 'GK' },
  { key: 'lb', label: 'LB' },
  { key: 'cb1', label: 'CB1' },
  { key: 'cb2', label: 'CB2' },
  { key: 'rb', label: 'RB' },
  { key: 'cm1', label: 'CM1' },
  { key: 'cm2', label: 'CM2' },
  { key: 'lw', label: 'LW' },
  { key: 'cam', label: 'CAM' },
  { key: 'rw', label: 'RW' },
  { key: 'st', label: 'ST' },
];

const joueursBarca = [
  'Marc-André ter Stegen', 'Joan García', 'Iñaki Peña', 'Wojciech Szczęsny',
  'Jules Koundé', 'Ronald Araújo', 'Andreas Christensen', 'Alejandro Baldé',
  'Pau Cubarsí', 'Íñigo Martínez', 'Héctor Fort',
  'Frenkie de Jong', 'Pedri', 'Gavi', 'Fermín López', 'Marc Casadó', 'Dani Olmo',
  'Lamine Yamal', 'Raphinha', 'Robert Lewandowski', 'Ferran Torres',
  'Ansu Fati', 'Pau Víctor'
];

const LineupPreview = ({ composition, setComposition }) => {
  return (
    <div className="terrain">
      {postes.map(({ key, label }) => (
        <div key={key} className={`poste ${key}`}>
          <div className="player-icon">⚽</div>
          <label>{label}</label>
          <select
            value={composition[label] || ''}
            onChange={(e) =>
              setComposition({ ...composition, [label]: e.target.value })
            }
          >
            <option value="">-- Choisir --</option>
            {joueursBarca.map((nom) => (
              <option key={nom} value={nom}>
                {nom}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default LineupPreview;
