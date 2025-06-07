import React, { useEffect, useState } from 'react';
import './Videos.css';
import './Home.css';
import VideoCard from '../components/VideoCard';


const API = 'https://back-barcapp.onrender.com';

const Home = () => {
  const [topVideos, setTopVideos] = useState([]);
  const [culers, setCulers] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resVideos, resShorts] = await Promise.all([
          fetch(`${API}/videos`),
          fetch(`${API}/videos/shorts`)
        ]);

        const videos = await resVideos.json();
        const shortsData = await resShorts.json();

        const videosOnly = videos.filter(v => !v.isShort);
        const culersOnly = videosOnly.filter(v => v.competition === 'Avis Culers');
        const topLiked = videosOnly
          .filter(v => v.competition !== 'Avis Culers')
          .sort((a, b) => b.likesCount - a.likesCount);

        setTopVideos(topLiked.slice(0, 12));
        setCulers(culersOnly.slice(0, 8));
        setShorts(shortsData.slice(0, 10));
      } catch (err) {
        console.error('❌ Erreur chargement vidéos homepage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <p style={{ padding: '20px', color: 'white' }}>Chargement en cours...</p>;

  return (
    <div className="videos-container">
      <h2>🏆 Les plus likées</h2>
      <div className="carousel-container">
        {topVideos.map((video) => (
          <div className="carousel-item" key={video._id}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '40px' }}>🎙️ Avis des Culers</h2>
      <div className="videos-grid">
        {culers.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      <h2 style={{ marginTop: '40px' }}>📱 Shorts du FC Barcelone</h2>
      <div className="carousel-container">
        {shorts.map((video) => (
          <div className="carousel-item" key={video._id}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
