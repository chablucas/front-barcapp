import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
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
        const res = await fetch(`${API}/videos`);
        const data = await res.json();
        console.log('📦 Vidéos récupérées :', data);

        // ❌ TEMP : on enlève le filtre isShort pour tout voir
        setVideos(data);
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
    const matchCompetition = competition
      ? video.competition?.toLowerCase() === competition.toLowerCase()
      : true;
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
          {filtered.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;
