import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './VideoDetail.css';

const API = 'https://back-barcapp.onrender.com/api';

const extractYouTubeID = (url) => {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : null;
};

const getTokenPayload = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const user = getTokenPayload();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await fetch(`${API}/videos/${id}`);
        const videoData = await videoRes.json();
        setVideo(videoData);
        setLikes(videoData.likesCount || videoData.likes?.length || 0);
        setDislikes(videoData.dislikesCount || videoData.dislikes?.length || 0);

        const commentsRes = await fetch(`${API}/comments/${id}`);
        const commentsData = await commentsRes.json();
        setComments(Array.isArray(commentsData) ? commentsData : []);

        if (user) {
          const meRes = await fetch(`${API}/users/me`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const meData = await meRes.json();
          setIsFavorite(meData.favorites?.includes(id));
        }
      } catch (err) {
        console.error(err);
        setMessage('Erreur lors du chargement');
      }
    };

    fetchData();
  }, [id, user]);

  const handleVote = async (type) => {
    try {
      const res = await fetch(`${API}/videos/${id}/${type}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (err) {
      setMessage('Erreur vote');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${API}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: newComment, videoId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur commentaire');

      setComments([...comments, data.comment]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      setMessage('Erreur commentaire');
    }
  };

  const toggleFavorite = async () => {
    try {
      const res = await fetch(`${API}/users/favorites/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setIsFavorite(data.favorites.includes(id));
    } catch (err) {
      setMessage('Erreur favoris');
    }
  };

  if (!video) return <p>Chargement...</p>;

  const videoId = extractYouTubeID(video.videoUrl);

  return (
    <div className="video-detail-page">
      <div className="video-header">
        <h2>{video.title}</h2>
        <div className="video-meta-info">
          <span className="video-competition">{video.competition}</span>
        </div>
        <p className="video-description">{video.description}</p>
      </div>

      {videoId && (
        <div className="video-player">
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {user && (
        <>
          <div className="video-actions">
            <button onClick={() => handleVote('like')}>👍 {likes}</button>
            <button onClick={() => handleVote('dislike')}>
              👎 {dislikes}
            </button>
            <button onClick={toggleFavorite}>
              {isFavorite ? '⭐ Retirer des favoris' : '☆ Ajouter aux favoris'}
            </button>
          </div>

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Votre commentaire"
              rows={3}
            />
            <button type="submit">💬 Publier</button>
          </form>
        </>
      )}

      {message && <p className="video-message">{message}</p>}

      <h3 className="comments-title">Commentaires</h3>
      <div className="comments-section">
        {comments.length === 0 && (
          <p className="comments-empty">Aucun commentaire pour le moment.</p>
        )}

        {comments.map((c) => {
          const author =
            typeof c.userId === 'object' && c.userId
              ? c.userId.username
              : 'Utilisateur';

          return (
            <div key={c._id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{author}</span>
                <span className="comment-date">
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString('fr-FR')
                    : ''}
                </span>
              </div>
              <div className="comment-content">{c.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoDetail;
