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
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
          // ✅ On met le user dans le state
          setUser(data);
          // ✅ On le sauvegarde aussi dans le localStorage pour la Sidebar
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          // Si le token n'est plus valide, on nettoie
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
    localStorage.removeItem('user'); // ✅ on nettoie aussi le user ici
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        navigate(`/recherche?search=${encodeURIComponent(query.trim())}`);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, navigate]);

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      navigate(`/recherche?search=${encodeURIComponent(query.trim())}`);
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
            className="search-button"
            onClick={() =>
              navigate(`/recherche?search=${encodeURIComponent(query.trim())}`)
            }
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
