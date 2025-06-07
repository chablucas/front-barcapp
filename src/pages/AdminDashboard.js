import React, { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const [videos, setVideos] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch(`${API}/videos`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setVideos(data);
            } catch (err) {
                setMessage(err.message);
            }
        };

        fetchVideos();
    }, []);

    const deleteVideo = async (id) => {
        if (!window.confirm("Supprimer cette vidéo ?")) return;

        try {
            const res = await fetch(`${API}/videos/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setVideos(videos.filter(v => v._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Dashboard Admin — Liste des Vidéos</h2>
            {message && <p>{message}</p>}
            {videos.length === 0 ? (
                <p>Aucune vidéo trouvée.</p>
            ) : (
                videos.map(video => (
                    <div key={video._id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
                        <h4>{video.title}</h4>
                        <p><strong>Compétition :</strong> {video.competition}</p>
                        <p>{video.description}</p>
                        <p><strong>Privée :</strong> {video.isPrivate ? 'Oui' : 'Non'}</p>
                        <p><strong>Commentaires :</strong> {video.commentCount}</p>
                        <a href={video.videoUrl} target="_blank" rel="noreferrer">Voir la vidéo</a>
                        <br />
                        <button onClick={() => deleteVideo(video._id)} style={{ marginTop: 8 }}>
                            🗑 Supprimer
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminDashboard;
