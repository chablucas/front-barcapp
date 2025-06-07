import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API = 'https://back-barcapp.onrender.com';

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
                setLikes(videoData.likes?.length || 0);
                setDislikes(videoData.dislikes?.length || 0);

                const commentsRes = await fetch(`${API}/comments/${id}`);
                const commentsData = await commentsRes.json();
                setComments(commentsData);

                if (user) {
                    const meRes = await fetch(`${API}/users/me`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const meData = await meRes.json();
                    setIsFavorite(meData.favorites?.includes(id));
                }
            } catch (err) {
                setMessage('Erreur lors du chargement');
            }
        };

        fetchData();
    }, [id, user]); // ✅ Ajouté `user` ici

    const handleVote = async (type) => {
        try {
            const res = await fetch(`${API}/videos/${id}/${type}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content: newComment, videoId: id })
            });
            const data = await res.json();
            setComments([...comments, data.comment]);
            setNewComment('');
        } catch (err) {
            setMessage('Erreur commentaire');
        }
    };

    const toggleFavorite = async () => {
        try {
            const res = await fetch(`${API}/users/favorites/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
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
        <div style={{ padding: '20px' }}>
            <h2>{video.title}</h2>
            <p><strong>Compétition :</strong> {video.competition}</p>
            <p>{video.description}</p>

            {videoId && (
                <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allowFullScreen
                    style={{ marginBottom: '20px', borderRadius: '8px' }}
                ></iframe>
            )}

            {user && (
                <>
                    <div style={{ marginBottom: '15px' }}>
                        <button onClick={() => handleVote('like')}>👍 {likes}</button>
                        <button onClick={() => handleVote('dislike')} style={{ marginLeft: '10px' }}>👎 {dislikes}</button>
                        <button onClick={toggleFavorite} style={{ marginLeft: '10px' }}>
                            {isFavorite ? '⭐ Retirer des favoris' : '☆ Ajouter aux favoris'}
                        </button>
                    </div>

                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Votre commentaire"
                            rows={3}
                            style={{ width: '100%' }}
                        />
                        <button type="submit">💬 Publier</button>
                    </form>
                </>
            )}

            <h3>Commentaires</h3>
            {comments.map(c => (
                <div key={c._id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                    <p><strong>{c.userId?.username || 'Utilisateur'}</strong></p>
                    <p>{c.content}</p>
                </div>
            ))}

            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
};

export default VideoDetail;
