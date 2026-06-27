import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const API = 'https://back-barcapp.onrender.com/api';

const AdminDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API}/videos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Erreur');
        }

        setVideos(data);
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchVideos();
  }, []);

  const deleteVideo = async (id) => {
    if (!window.confirm('Supprimer cette vidéo ?')) return;

    try {
      const res = await fetch(`${API}/videos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur');
      }

      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-dashboard-page">

      <div className="admin-dashboard-header">
        <span className="admin-badge">
          Administration
        </span>

        <h1>Gestion des vidéos</h1>

        <p>
          Retrouvez ici toutes les vidéos publiées sur Barçapp.
        </p>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <div className="admin-video-grid">

        {videos.length === 0 ? (
          <p>Aucune vidéo trouvée.</p>
        ) : (

          videos.map((video) => {

            const youtubeId =
              video.videoUrl?.includes('v=')
                ? video.videoUrl.split('v=')[1].split('&')[0]
                : '';

            return (

              <div
                key={video._id}
                className="admin-video-card"
              >

                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {youtubeId ? (
                    <img
                      src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                    />
                  ) : (
                    <div className="admin-thumbnail-empty">
                      Miniature indisponible
                    </div>
                  )}
                </a>

                <div className="admin-video-content">

                  <span className="competition">
                    {video.competition}
                  </span>

                  <h3>
                    {video.title}
                  </h3>

                  <p>
                    {video.description}
                  </p>

                  <div className="admin-video-stats">

                    <span>
                      💬 {video.commentCount}
                    </span>

                    <span>
                      {video.isPrivate ? '🔒 Privée' : '🌍 Publique'}
                    </span>

                  </div>

                  <button
                    className="delete-video-btn"
                    onClick={() => deleteVideo(video._id)}
                  >
                    🗑 Supprimer
                  </button>

                </div>

              </div>

            );
          })

        )}

      </div>

    </div>
  );
};

export default AdminDashboard;