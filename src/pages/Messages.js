import React, { useState } from 'react';
import './Messages.css'; // Assurez-vous d'avoir un fichier CSS pour le style

const API = 'https://back-barcapp.onrender.com/api';

const Messages = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (search.trim().length < 2) return;

    try {
      setError('');

      const res = await fetch(`${API}/users/search?q=${search}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur recherche utilisateur');
      }

      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>Messages privés</h2>

      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', borderRadius: '6px', marginRight: '8px' }}
      />

      <button onClick={handleSearch}>Rechercher</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        {users.map((user) => (
          <div key={user._id} style={{ marginBottom: '12px' }}>
            <img
              src={user.avatar || 'https://via.placeholder.com/50'}
              alt={user.username}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '10px',
                verticalAlign: 'middle',
              }}
            />
            <span>{user.username}</span>
            <button style={{ marginLeft: '10px' }}>
              Envoyer un message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;