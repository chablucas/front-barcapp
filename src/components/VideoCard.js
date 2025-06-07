import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css'; 

const VideoCard = ({ video, size }) => {
  const youtubeId = video.videoUrl?.includes('v=') ? video.videoUrl.split('v=')[1] : '';
  const [likes, setLikes] = useState(video.likesCount);
  const [dislikes, setDislikes] = useState(video.dislikesCount);

  const handleLike = async () => {
    try {
      const res = await fetch(`http://back-barcapp.onrender.com/api/videos/${video._id}/like`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (err) {
      console.error("Erreur like:", err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch(`http://back-barcapp.onrender.com/api/videos/${video._id}/dislike`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (err) {
      console.error("Erreur dislike:", err);
    }
  };

  return (
    <div className={`video-card ${size === 'small' ? 'video-card-small' : ''}`}>
      <Link to={`/video/${video._id}`}>
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
          alt={video.title}
        />
      </Link>

      <div className="video-meta">
        <span className="badge">{video.competition}</span>
        <span className="date">
          {new Date(video.createdAt).toLocaleDateString('fr-FR')}
        </span>
      </div>

      <h3>{video.title}</h3>
      <p>{video.description}</p>

      <div className="video-stats">
        <button onClick={handleLike}>👍 {likes}</button>
        <button onClick={handleDislike}>👎 {dislikes}</button>
        <span>💬 {video.commentCount}</span>
      </div>
    </div>
  );
};

export default VideoCard;
