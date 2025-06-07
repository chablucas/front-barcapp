import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // On réutilise Login.css

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');

      // Connexion immédiate après inscription
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.message || 'Erreur de connexion');

      localStorage.setItem('token', loginData.token);
      navigate('/');
      window.location.reload(); // Pour mettre à jour le Header
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">S'inscrire</button>
        </form>
        <button className="google-button" onClick={() => {
            window.location.href = 'http://localhost:5000/api/auth/google';
        }}>
        Se connecter avec Google
        </button>


        <p className="register-link">
          Déjà inscrit ? <a href="/login">Se connecter</a>
        </p>

        {message && <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
