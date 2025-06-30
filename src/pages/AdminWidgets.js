import React, { useState, useEffect } from 'react';
import './AdminWidgets.css';
import LineupPreview from '../components/LineupPreview';

const API = 'https://back-barcapp.onrender.com/api';

const joueursBarca = [
  'Marc-André ter Stegen', 'Joan García', 'Iñaki Peña', 'Wojciech Szczęsny',
  'Jules Koundé', 'Ronald Araújo', 'Andreas Christensen', 'Alejandro Baldé',
  'Pau Cubarsí', 'Íñigo Martínez', 'Héctor Fort',
  'Frenkie de Jong', 'Pedri', 'Gavi', 'Fermín López', 'Marc Casadó', 'Dani Olmo',
  'Lamine Yamal', 'Raphinha', 'Robert Lewandowski', 'Ferran Torres',
  'Ansu Fati', 'Pau Víctor'
];

const competitions = [
  'LaLiga', 'Ligue des Champions', 'Coupe du Roi', 'Supercoupe'
];

const AdminWidgets = () => {
  const [match, setMatch] = useState({
    homeTeam: 'Barça',
    awayTeam: '',
    score: '0 - 0',
    competition: '',
    events: [],
  });
  const [streakInput, setStreakInput] = useState('');
  const [streakList, setStreakList] = useState([]);
  const [composition, setComposition] = useState({});
  const [barcaHome, setBarcaHome] = useState(true);

  const getWidgets = async () => {
    try {
      const [matchRes, streakRes, lineupRes] = await Promise.all([
        fetch(`${API}/barca/match-live`),
        fetch(`${API}/barca/streak`),
        fetch(`${API}/barca/lineup`)
      ]);

      const matchData = await matchRes.json();
      const streakData = await streakRes.json();
      const lineupData = await lineupRes.json();

      if (matchData.homeTeam) setMatch(matchData);
      if (streakData.streak) setStreakList(streakData.streak);
      if (lineupData.lineup) {
        const postes = [
          'GK', 'RB', 'CB1', 'CB2', 'LB',
          'CM1', 'CM2', 'CAM',
          'RW', 'LW', 'ST'
        ];
        const compo = {};
        postes.forEach((poste, i) => compo[poste] = lineupData.lineup[i] || '');
        setComposition(compo);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des widgets', err);
    }
  };

  useEffect(() => {
    getWidgets();
  }, []);

  const updateMatch = async () => {
    const matchData = {
      ...match,
      homeTeam: barcaHome ? 'Barça' : match.homeTeam,
      awayTeam: barcaHome ? match.awayTeam : 'Barça'
    };

    const res = await fetch(`${API}/barca/match-live`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(matchData),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);
    alert('✅ Match mis à jour');
  };

  const updateLineup = async () => {
    const res = await fetch(`${API}/barca/lineup`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ composition }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);
    alert('✅ Composition mise à jour');
  };

  const addToStreak = async () => {
    const res = await fetch(`${API}/barca/streak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ match: streakInput }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);
    alert('✅ Série mise à jour');
    setStreakInput('');
    setStreakList(data.streak);
  };

  const adjustScore = (team, value) => {
    const [left, right] = match.score.split(' - ').map(Number);
    if (team === 'left') {
      setMatch({ ...match, score: `${Math.max(0, left + value)} - ${right}` });
    } else {
      setMatch({ ...match, score: `${left} - ${Math.max(0, right + value)}` });
    }
  };

  return (
    <div className="admin-widgets">
      <h2>⚙️ Gestion des Widgets</h2>

      <section className="widget-block">
        <h3>📅 Match en direct</h3>

        <div className="toggle">
          <label>Domicile : Barça</label>
          <input type="checkbox" checked={barcaHome} onChange={() => setBarcaHome(!barcaHome)} />
        </div>

        <select
          value={match.competition}
          onChange={(e) => setMatch({ ...match, competition: e.target.value })}
        >
          <option value="">-- Compétition --</option>
          {competitions.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="match-inputs">
          <input
            type="text"
            placeholder="Équipe adverse"
            value={barcaHome ? match.awayTeam : match.homeTeam}
            onChange={(e) =>
              setMatch({
                ...match,
                [barcaHome ? 'awayTeam' : 'homeTeam']: e.target.value
              })
            }
          />
          <div className="score-controls">
            <button onClick={() => adjustScore('left', -1)}>-</button>
            <span>{match.score}</span>
            <button onClick={() => adjustScore('left', 1)}>+</button>
          </div>
          <div className="score-controls">
            <button onClick={() => adjustScore('right', -1)}>-</button>
            <button onClick={() => adjustScore('right', 1)}>+</button>
          </div>
        </div>

        <textarea
          placeholder="Buts / Cartons / Changements"
          value={match.events.join('\n')}
          onChange={(e) => setMatch({ ...match, events: e.target.value.split('\n') })}
        />

        <button onClick={updateMatch}>💾 Sauvegarder le match</button>
      </section>

      <section className="widget-block">
        <h3>🧠 Composition officielle</h3>
        <LineupPreview
          composition={composition}
          setComposition={setComposition}
          joueurs={joueursBarca}
        />
        <button onClick={updateLineup}>💾 Sauvegarder la compo</button>
      </section>

      <section className="widget-block">
        <h3>🔵 Ajouter à la série de victoires</h3>
        <input
          type="text"
          placeholder="ex: Barça 2-0 Real Sociedad"
          value={streakInput}
          onChange={(e) => setStreakInput(e.target.value)}
        />
        <button onClick={addToStreak}>📥 Ajouter</button>

        <ul>
          {streakList.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </section>
    </div>
  );
};

export default AdminWidgets;
