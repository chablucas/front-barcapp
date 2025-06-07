import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API = 'http://localhost:5000/api';

const Recherche = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API}/videos`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Réponse invalide');
        const filtered = data.filter(v =>
          v.title?.toLowerCase().includes(query.toLowerCase()) ||
          v.description?.toLowerCase().includes(query.toLowerCase())
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

  if (loading) return <p style={{ padding: '20px', color: 'white' }}>Recherche en cours...</p>;

  return (
    <div className="videos-container">
      <h2 style={{ color: 'white', margin: '20px' }}>Résultats pour : "{query}"</h2>

      {videos.length === 0 ? (
        <p style={{ padding: '20px', color: 'white' }}>Aucune vidéo trouvée.</p>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <div className="video-card" key={video._id}>
              <a href={`/video/${video._id}`}>
                <img
                  src={`https://img.youtube.com/vi/${video.videoUrl.split('v=')[1]}/mqdefault.jpg`}
                  alt={video.title}
                />
              </a>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recherche;
