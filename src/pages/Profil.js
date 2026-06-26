import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Profil.css';
import LineupDisplay from '../components/LineupDisplay';

const API = 'https://back-barcapp.onrender.com/api';

const Profil = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isPublicProfile = Boolean(id);

  const [user, setUser] = useState(null);
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editName, setEditName] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const [editBanner, setEditBanner] = useState(false);

  const [newUsername, setNewUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  const [matchLive, setMatchLive] = useState(null);
  const [, setLineup] = useState([]);
  const [streak, setStreak] = useState([]);
  const [composition, setComposition] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (!token && !isPublicProfile) {
        navigate('/login');
        return;
      }

      try {
        const userUrl = isPublicProfile
          ? `${API}/users/${id}`
          : `${API}/users/me`;

        const userRes = await fetch(userUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (userRes.status === 401 && !isPublicProfile) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const userData = await userRes.json();

        if (!userRes.ok) {
          throw new Error(userData.message || 'Erreur chargement profil.');
        }

        setUser(userData);
        setNewUsername(userData.username || '');
        setAvatarPreview(userData.avatar || '');
        setBannerPreview(userData.banner || '');

        const likesRes = await fetch(`${API}/users/${userData._id}/likes`);
        const likesData = await likesRes.json();

        setLikedVideos(Array.isArray(likesData) ? likesData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchWidgets = async () => {
      try {
        const [matchRes, lineupRes, streakRes] = await Promise.all([
          fetch(`${API}/barca/match-live`),
          fetch(`${API}/barca/lineup`),
          fetch(`${API}/barca/streak`),
        ]);

        const matchData = await matchRes.json();
        const lineupData = await lineupRes.json();
        const streakData = await streakRes.json();

        setMatchLive(matchData);
        setLineup(lineupData.lineup || []);
        setStreak(streakData.streak || []);

        const postes = ['GK', 'RB', 'CB1', 'CB2', 'LB', 'CM1', 'CM2', 'CAM', 'RW', 'LW', 'ST'];
        const compo = {};

        postes.forEach((poste, i) => {
          compo[poste] = lineupData.lineup?.[i] || '';
        });

        setComposition(compo);
      } catch (err) {
        console.error('Erreur widgets:', err);
      }
    };

    fetchData();
    fetchWidgets();
  }, [navigate, id, isPublicProfile]);

  const handleUpdateUsername = async () => {
    try {
      const res = await fetch(`${API}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du pseudo.');
      }

      setUser(data);
      setEditName(false);
      toast.success('✅ Pseudo mis à jour !');
    } catch (err) {
      toast.error('❌ ' + err.message);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const res = await fetch(`${API}/users/me/avatar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour de l'avatar.");
      }

      const updatedUser = data.user || data;

      setUser(updatedUser);
      setAvatarPreview(updatedUser.avatar || '');
      setAvatarFile(null);
      setEditAvatar(false);

      toast.success('✅ Avatar mis à jour !');
    } catch (err) {
      toast.error('❌ ' + err.message);
    }
  };

  const handleUploadBanner = async () => {
    if (!bannerFile) return;

    const formData = new FormData();
    formData.append('banner', bannerFile);

    try {
      const res = await fetch(`${API}/users/me/banner`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour de la bannière.');
      }

      const updatedUser = data.user || data;

      setUser(updatedUser);
      setBannerPreview(updatedUser.banner || '');
      setBannerFile(null);
      setEditBanner(false);

      toast.success('✅ Bannière mise à jour !');
    } catch (err) {
      toast.error('❌ ' + err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profil-page">
      <main className="profil-center">
        <div className="profil-header">
          <div
            className="profil-banner"
            style={{
              backgroundImage: bannerPreview ? `url(${bannerPreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '180px',
              borderRadius: '12px',
            }}
          />

          <div className="profil-avatar-bar">
            <img
              src={avatarPreview || 'https://via.placeholder.com/100'}
              alt="avatar"
              className="profil-avatar"
            />

            {!isPublicProfile && (
              <div className="profil-buttons">
                {!editAvatar ? (
                  <button onClick={() => setEditAvatar(true)}>🖼 Changer de photo</button>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (!e.target.files || !e.target.files[0]) return;

                        const file = e.target.files[0];

                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }}
                    />
                    <button onClick={handleUploadAvatar}>📤 Sauvegarder</button>
                  </>
                )}

                {!editBanner ? (
                  <button onClick={() => setEditBanner(true)}>🎨 Changer la bannière</button>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (!e.target.files || !e.target.files[0]) return;

                        const file = e.target.files[0];

                        setBannerFile(file);
                        setBannerPreview(URL.createObjectURL(file));
                      }}
                    />
                    <button onClick={handleUploadBanner}>📤 Sauvegarder</button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="profil-username">
            {isPublicProfile ? (
              <h2>{user?.username}</h2>
            ) : !editName ? (
              <>
                <h2>{user?.username}</h2>
                <button onClick={() => setEditName(true)}>✏️ Modifier</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <button onClick={handleUpdateUsername}>💾 Sauvegarder</button>
              </>
            )}
          </div>
        </div>

        <div className="profil-feed">
          <h3>👍 Vidéos Likées</h3>

          {likedVideos.length === 0 ? (
            <p>Aucune vidéo likée.</p>
          ) : (
            likedVideos.map((video) => {
              const youtubeId = video.videoUrl?.includes('v=')
                ? video.videoUrl.split('v=')[1].split('&')[0]
                : '';

              return (
                <div className="profil-video-card" key={video._id}>
                  <Link to={`/video/${video._id}`}>
                    <img
                      src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                    />
                  </Link>

                  <div className="profil-video-info">
                    <span className="badge">{video.competition}</span>
                    <span className="date">
                      {new Date(video.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <h3>{video.title}</h3>
                  <p>{video.description}</p>

                  <div className="profil-stats">
                    <span>👍 {video.likesCount}</span>
                    <span>👎 {video.dislikesCount}</span>
                    <span>💬 {video.commentCount}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <aside className="profil-widgets">
        <div className="widget">
          <h4>📅 Prochain match</h4>

          {matchLive ? (
            <>
              <p>{matchLive.homeTeam} vs {matchLive.awayTeam}</p>
              <p>🏆 {matchLive.competition}</p>
              <p>Score : {matchLive.score}</p>
              <p>📝 {matchLive.events?.join(', ')}</p>
            </>
          ) : (
            <p>Match non disponible</p>
          )}
        </div>

        <div className="widget">
          <h4>🧠 Composition officielle</h4>
          <LineupDisplay composition={composition} />
        </div>

        <div className="widget">
          <h4>🔵 Série de victoires</h4>
          <ul>
            {streak.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Profil;