import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Videos.css';

const API = 'https://back-barcapp.onrender.com/api';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get('search') || '';
  const competition = new URLSearchParams(location.search).get('competition') || '';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API}/videos`, {
          headers: {
            Accept: 'application/json'
          }
        });

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("Réponse invalide du serveur");
        }

        const data = await res.json();
        const nonShorts = data.filter(video => video.isShort !== true);
        setVideos(nonShorts);
      } catch (err) {
        console.error('❌ Erreur chargement vidéos:', err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [location.search]);

  const handleFilter = (comp) => {
    if (comp === 'Toutes') {
      navigate('/videos');
    } else {
      navigate(`/videos?competition=${encodeURIComponent(comp)}`);
    }
  };

  const filtered = videos.filter(video => {
    const matchSearch = video.title?.toLowerCase().includes(query.toLowerCase());
    const matchCompetition = competition ? video.competition === competition : true;
    return matchSearch && matchCompetition;
  });

  if (loading) {
    return <p style={{ padding: '20px', color: 'white' }}>Chargement des vidéos...</p>;
  }

  return (
    <div className="videos-container">
      <div className="video-filters">
        {['Toutes', 'LaLiga', 'Ligue des Champions', 'Coupe du Roi', 'Supercoupe d’Espagne', 'Avis Culers'].map((c) => (
          <button
            key={c}
            onClick={() => handleFilter(c)}
            style={{
              backgroundColor: (c === competition || (c === 'Toutes' && !competition)) ? '#FDB913' : '',
              color: (c === competition || (c === 'Toutes' && !competition)) ? 'black' : ''
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ padding: '20px', color: 'white' }}>Aucune vidéo trouvée.</p>
      ) : (
        <div className="videos-grid">
          {filtered.map(video => {
            const youtubeId = video.videoUrl?.includes('v=') ? video.videoUrl.split('v=')[1] : '';
            return (
              <div className="video-card" key={video._id}>
                <a href={`/video/${video._id}`}>
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                  />
                </a>

                <div className="video-meta">
                  <span className="badge">{video.competition}</span>
                  <span className="date">
                    {new Date(video.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <h3>{video.title}</h3>
                <p>{video.description}</p>

                <div className="video-stats">
                  <span>👍 {video.likesCount}</span>
                  <span>👎 {video.dislikesCount}</span>
                  <span>💬 {video.commentCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Videos;
