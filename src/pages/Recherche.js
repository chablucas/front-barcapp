import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const API = 'https://back-barcapp.onrender.com/api';

const Recherche = () => {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const videosRes = await fetch(`${API}/videos`);
        const videosData = await videosRes.json();

        if (Array.isArray(videosData)) {
          const lower = query.toLowerCase();

          const filteredVideos = videosData.filter(v =>
            v.title?.toLowerCase().includes(lower) ||
            v.description?.toLowerCase().includes(lower)
          );

          setVideos(filteredVideos);
        } else {
          setVideos([]);
        }

        if (query.trim().length >= 2) {
          const token = localStorage.getItem('token');

          if (token) {
            const usersRes = await fetch(`${API}/users/search?q=${encodeURIComponent(query)}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const usersData = await usersRes.json();

            if (usersRes.ok && Array.isArray(usersData)) {
              setUsers(usersData);
            } else {
              setUsers([]);
            }
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
  }, [query]);

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

      navigate('/messages');
    } catch (err) {
      console.error('Erreur conversation :', err.message);
      alert(err.message);
    }
  };

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

      {users.length > 0 && (
        <div style={{ margin: '20px' }}>
          <h3 style={{ color: '#FDB913', marginBottom: '15px' }}>
            Utilisateurs
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
            {users.map((user) => (
              <div
                key={user._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#06397e',
                  padding: '12px',
                  borderRadius: '12px',
                }}
              >
                <img
                  src={user.avatar || 'https://via.placeholder.com/50'}
                  alt={user.username}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #FDB913',
                    backgroundColor: 'white',
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: '#FDB913' }}>
                    {user.username}
                  </h4>
                  <p style={{ margin: '4px 0 0', color: '#ddd', fontSize: '13px' }}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>

                <button
                  onClick={() => handleStartConversation(user._id)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#FDB913',
                    color: 'black',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  💬 Message privé
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 style={{ color: '#FDB913', margin: '20px' }}>
        Vidéos
      </h3>

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