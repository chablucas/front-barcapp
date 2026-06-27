import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './Recherche.css';

const API = 'https://back-barcapp.onrender.com/api';

const Recherche = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('search') || '';

  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const hasQuery = query.trim().length >= 2;

  useEffect(() => {
    const fetchResults = async () => {
      if (!hasQuery) {
        setVideos([]);
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const videosRes = await fetch(`${API}/videos`);
        const videosData = await videosRes.json();

        if (Array.isArray(videosData)) {
          const lower = query.toLowerCase();

          const filteredVideos = videosData.filter(
            (v) =>
              v.title?.toLowerCase().includes(lower) ||
              v.description?.toLowerCase().includes(lower)
          );

          setVideos(filteredVideos);
        } else {
          setVideos([]);
        }

        const token = localStorage.getItem('token');

        if (token) {
          const usersRes = await fetch(
            `${API}/users/search?q=${encodeURIComponent(query)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const usersData = await usersRes.json();

          if (usersRes.ok && Array.isArray(usersData)) {
            setUsers(usersData);
          } else {
            setUsers([]);
          }
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error('Erreur recherche :', err.message);
        setVideos([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, hasQuery]);

  const handleStartConversation = async (userId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`${API}/conversations/start/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur création conversation');
      }

      navigate(`/messages?conversationId=${data._id}`);
    } catch (err) {
      console.error('Erreur conversation :', err.message);
      alert(err.message);
    }
  };

  return (
    <div className="recherche-page">
      <h2 className="recherche-title">Recherche</h2>

      {!hasQuery && (
        <p className="recherche-info">
          Lance une recherche depuis la barre en haut.
        </p>
      )}

      {loading && (
        <p className="recherche-info">
          Recherche en cours...
        </p>
      )}

      {!loading && hasQuery && (
        <>
          <h2 className="recherche-subtitle">
            Résultats pour : "{query}"
          </h2>

          {users.length > 0 && (
            <section className="recherche-section">
              <h3 className="recherche-section-title">Utilisateurs</h3>

              <div className="search-users-list">
                {users.map((user) => (
                  <div className="search-user-card" key={user._id}>
                    <Link to={`/profil/${user._id}`} className="search-user-link">
                      <img
                        src={user.avatar || 'https://via.placeholder.com/50'}
                        alt={user.username}
                        className="search-user-avatar"
                      />

                      <div>
                        <h4 className="search-user-name">
                          {user.username}
                        </h4>

                        <p className="search-user-role">
                          {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      className="search-message-btn"
                      onClick={() => handleStartConversation(user._id)}
                    >
                      💬 Message privé
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="recherche-section">
            <h3 className="recherche-section-title">Vidéos</h3>

            {videos.length === 0 ? (
              <p className="recherche-info">Aucune vidéo trouvée.</p>
            ) : (
              <div className="videos-grid">
                {videos.map((video) => {
                  const youtubeId = video.videoUrl?.includes('v=')
                    ? video.videoUrl.split('v=')[1].split('&')[0]
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
                          <div className="video-thumbnail-empty">
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
          </section>
        </>
      )}
    </div>
  );
};

export default Recherche;