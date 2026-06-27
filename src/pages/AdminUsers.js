import React, { useEffect, useState } from 'react';
import './AdminUsers.css';

const API = 'https://back-barcapp.onrender.com/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      const res = await fetch(`${API}/users/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur chargement utilisateurs');
      }

      setUsers(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API}/users/admin/${id}/block`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur blocage');
      }

      setMessage(data.message);
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const changeRole = async (id, role) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API}/users/admin/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur rôle');
      }

      setMessage(data.message);
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return <p className="admin-users-loading">Chargement des utilisateurs...</p>;
  }

  return (
    <div className="admin-users-page">
      <div className="admin-users-header">
        <span className="admin-users-badge">Admin</span>
        <h1>Gestion des utilisateurs</h1>
        <p>Bloque les utilisateurs abusifs ou modifie les rôles.</p>
      </div>

      {message && <div className="admin-users-message">{message}</div>}

      <div className="admin-users-list">
        {users.map((user) => (
          <div
            key={user._id}
            className={`admin-user-card ${user.isBlocked ? 'blocked' : ''}`}
          >
            <img
              src={user.avatar || 'https://via.placeholder.com/50?text=👤'}
              alt={user.username || user.email}
              className="admin-user-avatar"
            />

            <div className="admin-user-info">
              <h3>{user.username || 'Sans pseudo'}</h3>
              <p>{user.email}</p>

              <div className="admin-user-meta">
                <span>Rôle : <strong>{user.role}</strong></span>
                <span className={user.isBlocked ? 'status-blocked' : 'status-active'}>
                  {user.isBlocked ? 'Bloqué' : 'Actif'}
                </span>
              </div>
            </div>

            <div className="admin-user-actions">
              <select
                value={user.role}
                onChange={(e) => changeRole(user._id, e.target.value)}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>

              <button
                onClick={() => toggleBlock(user._id)}
                className={user.isBlocked ? 'unblock-btn' : 'block-btn'}
              >
                {user.isBlocked ? 'Débloquer' : 'Bloquer'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;