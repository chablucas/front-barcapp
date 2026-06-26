import React, { useEffect, useState } from 'react';

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
      console.error(err.message);
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
    return (
      <p style={{ color: 'white', padding: '20px' }}>
        Chargement des utilisateurs...
      </p>
    );
  }

  return (
    <div style={{ padding: '25px', color: 'white' }}>
      <h1 style={{ color: '#FDB913', marginBottom: '10px' }}>
        Gestion des utilisateurs
      </h1>

      <p style={{ color: '#ddd', marginBottom: '20px' }}>
        Bloque les utilisateurs abusifs ou modifie les rôles.
      </p>

      {message && (
        <p
          style={{
            backgroundColor: '#06397e',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
          }}
        >
          {message}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {users.map((user) => (
          <div
            key={user._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              backgroundColor: '#071f49',
              padding: '15px',
              borderRadius: '14px',
              border: user.isBlocked ? '2px solid #ff4d4d' : '1px solid #174a9c',
            }}
          >
            <img
              src={user.avatar || 'https://via.placeholder.com/50?text=👤'}
              alt={user.username || user.email}
              style={{
                width: '55px',
                height: '55px',
                borderRadius: '50%',
                objectFit: 'cover',
                backgroundColor: 'white',
              }}
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, color: '#FDB913' }}>
                {user.username || 'Sans pseudo'}
              </h3>

              <p style={{ margin: '4px 0', color: '#ddd', fontSize: '14px' }}>
                {user.email}
              </p>

              <p style={{ margin: 0, fontSize: '13px' }}>
                Rôle : <strong>{user.role}</strong> | Statut :{' '}
                <strong style={{ color: user.isBlocked ? '#ff4d4d' : '#5cff8d' }}>
                  {user.isBlocked ? 'Bloqué' : 'Actif'}
                </strong>
              </p>
            </div>

            <select
              value={user.role}
              onChange={(e) => changeRole(user._id, e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
              }}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <button
              onClick={() => toggleBlock(user._id)}
              style={{
                padding: '9px 13px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: user.isBlocked ? '#5cff8d' : '#ff4d4d',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              {user.isBlocked ? 'Débloquer' : 'Bloquer'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;