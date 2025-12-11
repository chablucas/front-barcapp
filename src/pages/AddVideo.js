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
        // On affiche le message détaillé renvoyé par le backend si dispo
        throw new Error(data.message || data.error || 'Erreur lors de l’ajout de la vidéo.');
      }

      setMessage('Vidéo ajoutée avec succès !');

      // Reset du formulaire
      setForm({
        title: '',
        description: '',
        competition: '',
        videoUrl: ''
      });
    } catch (err) {
      console.error('Erreur ajout vidéo :', err);
      setMessage(err.message || 'Erreur réseau.');
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

        <label className="select-label">Section :</label>
        <select
          name="competition"
          value={form.competition}
          onChange={handleChange}
          required
        >
          <option value="">-- Choisir une section --</option>
          <option value="Résumé de match">Résumé de match</option>
          <option value="LaLiga">LaLiga</option>
          <option value="Ligue des Champions">Ligue des Champions</option>
          <option value="Highlights">Highlights</option>
          <option value="Avis Culers">Avis Culers</option>
          <option value="Mercato">Mercato</option>
          <option value="Conférence de presse">Conférence de presse</option>
        </select>

        <button type="submit" className="add-video-button">
          Ajouter
        </button>
      </form>

      {message && <p className="add-video-message">{message}</p>}
    </div>
  );
};

export default AddVideo;
