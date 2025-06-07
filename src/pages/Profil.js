import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './Profil.css';
import LineupDisplay from '../components/LineupDisplay';

const API = 'https://back-barcapp.onrender.com/api';

const Profil = () => {
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
  const [lineup, setLineup] = useState([]);
  const [streak, setStreak] = useState([]);
  const [composition, setComposition] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const userRes = await fetch(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userRes.ok) throw new Error(userData.message);
        setUser(userData);
        setNewUsername(userData.username);
        setAvatarPreview(userData.avatar || '');
        setBannerPreview(userData.banner || '');

        const likesRes = await fetch(`${API}/users/${userData._id}/likes`);
        const likesData = await likesRes.json();
        if (!likesRes.ok) throw new Error(likesData.message);
        setLikedVideos(likesData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchWidgets = async () => {
      try {
        const [matchRes, lineupRes, streakRes] = await Promise.all([
          fetch(`${API}/barca/match-live`),
          fetch(`${API}/barca/lineup`),
          fetch(`${API}/barca/streak`)
        ]);

        const matchData = await matchRes.json();
        const lineupData = await lineupRes.json();
        const streakData = await streakRes.json();

        setMatchLive(matchData);
        setLineup(lineupData.lineup || []);
        setStreak(streakData.streak || []);

        const postes = ['GK', 'RB', 'CB1', 'CB2', 'LB', 'CM1', 'CM2', 'CAM', 'RW', 'LW', 'ST'];
        const compo = {};
        postes.forEach((poste, i) => compo[poste] = lineupData.lineup[i] || '');
        setComposition(compo);
      } catch (err) {
        console.error('Erreur widgets:', err);
      }
    };

    fetchData();
    fetchWidgets();
  }, []);

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
      if (!res.ok) throw new Error(data.message);
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data.user);
      setAvatarPreview(data.user.avatar);
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data.user);
      setBannerPreview(data.user.banner);
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
      <div className="profil-center">
        {/* Header utilisateur + bannière */}
        <div className="profil-header">
          <div
            className="profil-banner"
            style={{
              backgroundImage: `url(${bannerPreview})`,
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
            <div className="profil-buttons">
              {!editAvatar ? (
                <button onClick={() => setEditAvatar(true)}>🖼 Changer de photo</button>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setAvatarFile(e.target.files[0]);
                      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
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
                      setBannerFile(e.target.files[0]);
                      setBannerPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                  <button onClick={handleUploadBanner}>📤 Sauvegarder</button>
                </>
              )}
            </div>
          </div>
          <div className="profil-username">
            {!editName ? (
              <>
                <h2>{user.username}</h2>
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

        {/* Vidéos likées */}
        <div className="profil-feed">
          <h3>👍 Vidéos Likées</h3>
          {likedVideos.length === 0 ? (
            <p>Aucune vidéo likée.</p>
          ) : (
            likedVideos.map((video) => (
              <div className="profil-video-card" key={video._id}>
                <a href={`/video/${video._id}`}>
                  <img
                    src={`https://img.youtube.com/vi/${video.videoUrl.split('v=')[1]}/mqdefault.jpg`}
                    alt={video.title}
                  />
                </a>
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
            ))
          )}
        </div>
      </div>

      {/* Widgets */}
      <div className="profil-widgets">
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
      </div>
    </div>
  );
};

export default Profil;
