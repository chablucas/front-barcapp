import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const API = 'https://back-barcapp.onrender.com/api';

const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const menuRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          localStorage.removeItem('user');
        }
      } catch (err) {
        localStorage.removeItem('user');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const handleSearch = () => {
    const cleanQuery = query.trim();

    if (cleanQuery.length < 2) {
      setQuery('');
      return;
    }

    navigate(`/recherche?search=${encodeURIComponent(cleanQuery)}`);
    setQuery('');
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">
          <img src="/uploads/logo_barcapp.png" alt="logo" className="logo" />
        </Link>
      </div>

      <div className="header-center">
        <div className="nav-buttons">
          <Link to="/videos" className="nav-button">Vidéos</Link>
          <Link to="/shorts" className="nav-button">Shorts</Link>
          {user && <Link to="/messages" className="nav-button">Messages</Link>}
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-bar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleEnter}
          />

          <button
            type="button"
            className="search-button"
            onClick={handleSearch}
          >
            🔍
          </button>
        </div>
      </div>

      <div className="header-right" ref={menuRef}>
        {user ? (
          <div className="profile-menu">
            <img
              src={user.avatar || 'https://via.placeholder.com/40?text=👤'}
              alt="avatar"
              className="profile-avatar"
              onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
              <div className="dropdown-menu">
                <span className="dropdown-name">{user.username}</span>
                <Link to="/profil">Mon profil</Link>
                <button onClick={handleLogout}>Se déconnecter</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-button">Connexion</Link>
        )}
      </div>
    </header>
  );
};

export default Header;