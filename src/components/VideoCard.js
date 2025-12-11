import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

const API = 'https://back-barcapp.onrender.com/api';

const VideoCard = ({ video }) => {
  // Récupération propre de l’ID YouTube
  let youtubeId = '';
  if (video.videoUrl?.includes('v=')) {
    youtubeId = video.videoUrl.split('v=')[1].split('&')[0];
  }

  const [likes, setLikes] = useState(video.likesCount || 0);
  const [dislikes, setDislikes] = useState(video.dislikesCount || 0);

  const handleLike = async () => {
    try {
      const res = await fetch(`${API}/videos/${video._id}/like`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur like');
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (err) {
      console.error('Erreur like:', err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch(`${API}/videos/${video._id}/dislike`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur dislike');
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (err) {
      console.error('Erreur dislike:', err);
    }
  };

  return (
    <div className="video-card">
      <Link to={`/video/${video._id}`}>
        <div className="video-thumbnail-wrapper">
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
            alt={video.title}
            className="video-thumbnail"
          />
        </div>
      </Link>

      <div className="video-meta">
        <span className="badge">{video.competition}</span>
        <span className="date">
          {new Date(video.createdAt || video.publishedAt).toLocaleDateString('fr-FR')}
        </span>
      </div>

      <h3 className="video-title">{video.title}</h3>
      <p className="video-description">{video.description}</p>

      <div className="video-stats">
        <button type="button" className="stat-button" onClick={handleLike}>
          👍 {likes}
        </button>
        <button type="button" className="stat-button" onClick={handleDislike}>
          👎 {dislikes}
        </button>
        <span className="stat-comments">💬 {video.commentCount || 0}</span>
      </div>
    </div>
  );
};

export default VideoCard;
