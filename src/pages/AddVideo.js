import React, { useState } from 'react';
import './AddVideo.css';

const AddVideo = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        competition: 'Avis Culers',
        videoUrl: '',
        isPrivate: true
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://back-barcapp.onrender.com/api/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erreur lors de l’ajout');

            setMessage('Vidéo ajoutée avec succès !');
            setForm({ title: '', description: '', competition: 'Avis Culers', videoUrl: '', isPrivate: true });
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className="add-video-container">
            <h2 className="add-video-title">🎥 Ajouter une vidéo</h2>
            <form className="add-video-form" onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Titre" value={form.title} onChange={handleChange} required />
                <input type="text" name="videoUrl" placeholder="Lien de la vidéo" value={form.videoUrl} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

                {/* Section affichée à l’utilisateur */}
                <p style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Section : <span style={{ color: '#FFD700' }}>Avis Culers</span>
                </p>

                {/* Champ caché pour envoyer au backend */}
                <input type="hidden" name="competition" value="Avis Culers" />

                <label className="checkbox-label">
                    <input type="checkbox" name="isPrivate" checked={form.isPrivate} onChange={handleChange} />
                    Vidéo privée ?
                </label>

                <button type="submit" className="add-video-button">Ajouter</button>
            </form>

            {message && <p className="add-video-message">{message}</p>}
        </div>
    );
};

export default AddVideo;
