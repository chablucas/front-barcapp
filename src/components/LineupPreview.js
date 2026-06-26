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
  // Gardiens
  'Joan García',
  'Marc-André ter Stegen',
  'Wojciech Szczęsny',

  // Défenseurs
  'Jules Koundé',
  'Ronald Araújo',
  'Pau Cubarsí',
  'Íñigo Martínez',
  'Andreas Christensen',
  'Alejandro Baldé',
  'Eric García',
  'Héctor Fort',
  'Gerard Martín',

  // Milieux
  'Frenkie de Jong',
  'Pedri',
  'Gavi',
  'Marc Casadó',
  'Marc Bernal',
  'Fermín López',
  'Dani Olmo',

  // Attaquants
  'Lamine Yamal',
  'Raphinha',
  'Robert Lewandowski',
  'Ferran Torres',
  'Roony Bardghji',
  'Marcus Rashford',
  'Gordon'
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
