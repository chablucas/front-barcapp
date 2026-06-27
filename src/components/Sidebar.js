import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));

  // Visible uniquement pour les admins
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <nav className="sidebar">

      <Link
        to="/ajouter-video"
        className={location.pathname === '/ajouter-video' ? 'active' : ''}
        title="Ajouter une vidéo"
      >
        ➕
      </Link>

      <Link
        to="/admin/dashboard"
        className={location.pathname === '/admin/dashboard' ? 'active' : ''}
        title="Gestion des vidéos"
      >
        🎥
      </Link>

      <Link
        to="/admin/widgets"
        className={location.pathname === '/admin/widgets' ? 'active' : ''}
        title="Widgets"
      >
        ⚙️
      </Link>

      <Link
        to="/admin/users"
        className={location.pathname === '/admin/users' ? 'active' : ''}
        title="Gestion des utilisateurs"
      >
        👥
      </Link>

    </nav>
  );
};

export default Sidebar;