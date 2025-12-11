import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const API = 'https://back-barcapp.onrender.com/api';

const Recherche = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/videos`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Réponse invalide');

        const lower = query.toLowerCase();
        const filtered = data.filter(v =>
          v.title?.toLowerCase().includes(lower) ||
          v.description?.toLowerCase().includes(lower)
        );

        setVideos(filtered);
      } catch (err) {
        console.error('Erreur recherche vidéos :', err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  if (loading) {
    return (
      <p style={{ padding: '20px', color: 'white' }}>
        Recherche en cours...
      </p>
    );
  }

  return (
    <div className="videos-container">
      <h2 style={{ color: 'white', margin: '20px' }}>
        Résultats pour : "{query}"
      </h2>

      {videos.length === 0 ? (
        <p style={{ padding: '20px', color: 'white' }}>
          Aucune vidéo trouvée.
        </p>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => {
            const youtubeId = video.videoUrl?.includes('v=')
              ? video.videoUrl.split('v=')[1]
              : '';
            return (
              <div className="video-card" key={video._id}>
                <Link to={`/video/${video._id}`}>
                  {youtubeId ? (
                    <img
                      src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                    />
                  ) : (
                    <div
                      style={{
                        width: '320px',
                        height: '180px',
                        background: '#222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      Miniature indisponible
                    </div>
                  )}
                </Link>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Recherche;
