import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));

  // ❗ Visible uniquement pour les admins
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <nav className="sidebar">
      <Link
        to="/ajouter-video"
        className={location.pathname === '/ajouter-video' ? 'active' : ''}
      >
        ➕
      </Link>

      <Link
        to="/admin/widgets"
        className={location.pathname === '/admin/widgets' ? 'active' : ''}
      >
        ⚙️
      </Link>
    </nav>
  );
};

export default Sidebar;
