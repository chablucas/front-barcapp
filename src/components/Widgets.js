import React from 'react';
import './Widgets.css';

const Widgets = () => {
  return (
    <aside className="widgets">
      <div className="widget-card">📈 Série de victoires (à venir)</div>
      <div className="widget-card">📝 Compo officielle (à venir)</div>
      <div className="widget-card">🕒 Prochain match (score live)</div>
    </aside>
  );
};

export default Widgets;
