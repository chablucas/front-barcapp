import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import './Shorts.css';

const API = 'https://back-barcapp.onrender.com';

const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const res = await fetch(`${API}/videos/shorts`);
        const data = await res.json();

        console.log('📱 Shorts détectés :', data);
        setShorts(data);
      } catch (err) {
        console.error('❌ Erreur chargement shorts:', err);
        setShorts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, []);

  if (loading) return <p style={{ padding: '20px', color: 'white' }}>Chargement des shorts...</p>;

  return (
    <div className="shorts-page">
      <h2 className="shorts-title">📱 Shorts du FC Barcelone</h2>
      <div className="shorts-grid">
        {shorts.length === 0 ? (
          <p style={{ color: 'white' }}>Aucun short trouvé.</p>
        ) : (
          shorts.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default Shorts;
