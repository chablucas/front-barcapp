import React, { useState } from 'react';
import './AddVideo.css';

const API = 'https://back-barcapp.onrender.com/api';

const AddVideo = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    competition: '',
    videoUrl: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Vous devez être connecté pour ajouter une vidéo.');
        return;
      }

      const response = await fetch(`${API}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l’ajout');
      }

      setMessage('Vidéo ajoutée avec succès !');

      setForm({
        title: '',
        description: '',
        competition: '',
        videoUrl: ''
      });
    } catch (err) {
      setMessage(err.message || 'Erreur réseau');
    }
  };

  return (
    <div className="add-video-container">
      <h2 className="add-video-title">🎥 Ajouter une vidéo</h2>

      <form className="add-video-form" onSubmit={handleSubmit}>
        
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="videoUrl"
          placeholder="Lien YouTube"
          value={form.videoUrl}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        {/* SELECT SECTION */}
        <label className="select-label">Section :</label>
        <select
          name="competition"
          className="select-input"
          value={form.competition}
          onChange={handleChange}
          required
        >
          <option value="">-- Choisir une section --</option>
          <option value="LaLiga">LaLiga</option>
          <option value="Ligue des Champions">Ligue des Champions</option>
          <option value="Coupe du Roi">Coupe du Roi</option>
          <option value="Supercoupe d’Espagne">Supercoupe d’Espagne</option>
          <option value="Avis Culers">Avis Culers</option>
        </select>

        <button type="submit" className="add-video-button">Ajouter</button>
      </form>

      {message && <p className="add-video-message">{message}</p>}
    </div>
  );
};

export default AddVideo;
