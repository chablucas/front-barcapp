import React, { useEffect, useState } from 'react';
import './Videos.css';
import './Home.css';
import VideoCard from '../components/VideoCard';
import LineupDisplay from '../components/LineupDisplay';
import QuizWidget from '../components/QuizWidget';

const API = 'https://back-barcapp.onrender.com/api';

const Home = () => {
  const [topVideos, setTopVideos] = useState([]);
  const [culers, setCulers] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [matchLive, setMatchLive] = useState(null);
  const [streak, setStreak] = useState([]);
  const [composition, setComposition] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resVideos, resShorts, matchRes, lineupRes, streakRes] = await Promise.all([
          fetch(`${API}/videos`),
          fetch(`${API}/videos/shorts`),
          fetch(`${API}/barca/match-live`),
          fetch(`${API}/barca/lineup`),
          fetch(`${API}/barca/streak`),
        ]);

        const videos = await resVideos.json();
        const shortsData = await resShorts.json();
        const matchData = await matchRes.json();
        const lineupData = await lineupRes.json();
        const streakData = await streakRes.json();

        const videosOnly = Array.isArray(videos)
          ? videos.filter((v) => !v.isShort)
          : [];

        const culersOnly = videosOnly.filter((v) => v.competition === 'Avis Culers');

        const topLiked = videosOnly
          .filter((v) => v.competition !== 'Avis Culers')
          .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));

        setTopVideos(topLiked.slice(0, 12));
        setCulers(culersOnly.slice(0, 8));
        setShorts(Array.isArray(shortsData) ? shortsData.slice(0, 10) : []);
        setMatchLive(matchData);
        setStreak(streakData.streak || []);

        const postes = ['GK', 'RB', 'CB1', 'CB2', 'LB', 'CM1', 'CM2', 'CAM', 'RW', 'LW', 'ST'];
        const compo = {};

        postes.forEach((poste, i) => {
          compo[poste] = lineupData.lineup?.[i] || '';
        });

        setComposition(compo);
      } catch (err) {
        console.error('❌ Erreur chargement homepage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <p style={{ padding: '20px', color: 'white' }}>
        Chargement en cours...
      </p>
    );
  }

  return (
    <div className="home-page">
      <div className="home-main">
        <section className="home-hero">
          <div>
            <span className="home-badge">Plateforme communautaire Barça</span>

            <h1>Bienvenue sur Barçapp</h1>

            <p>
              Barçapp est une plateforme dédiée aux fans du FC Barcelone.
              Le site permet de regarder des vidéos, découvrir des shorts,
              consulter les avis des Culers, commenter, liker, échanger en message privé
              et suivre les informations importantes du club grâce aux widgets.
            </p>

            <div className="home-actions">
              <a href="/videos">Voir les vidéos</a>
              <a href="/shorts" className="secondary">Voir les shorts</a>
            </div>
          </div>
        </section>

        <section className="home-explain">
          <h2>À quoi sert le site ?</h2>

          <div className="home-explain-grid">
            <div>
              <h3>🎥 Vidéos Barça</h3>
              <p>Retrouver les résumés, temps forts et contenus autour du club.</p>
            </div>

            <div>
              <h3>🎙️ Avis des Culers</h3>
              <p>Centraliser les avis, analyses et réactions des supporters.</p>
            </div>

            <div>
              <h3>💬 Communauté</h3>
              <p>Commenter les vidéos, liker et discuter avec les autres utilisateurs.</p>
            </div>
          </div>
        </section>

        <QuizWidget />

        <section>
          <h2>🏆 Les plus likées</h2>
          <div className="carousel-container">
            {topVideos.map((video) => (
              <div className="carousel-item" key={video._id}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>🎙️ Avis des Culers</h2>
          <div className="carousel-container">
            {culers.map((video) => (
              <div className="carousel-item" key={video._id}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>📱 Shorts du FC Barcelone</h2>
          <div className="carousel-container">
            {shorts.map((video) => (
              <div className="carousel-item" key={video._id}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="home-widgets">
        <div className="home-widget">
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

        <div className="home-widget">
          <h4>🧠 Composition officielle</h4>
          <LineupDisplay composition={composition} />
        </div>

        <div className="home-widget">
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

export default Home;