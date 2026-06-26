import React, { useEffect, useState } from 'react';
import './QuizWidget.css';

const API = 'https://back-barcapp.onrender.com/api';

const QuizWidget = () => {
  const [quiz, setQuiz] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [instantResult, setInstantResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem('token');

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API}/quiz/leaderboard`);
      const data = await res.json();
      if (Array.isArray(data)) setLeaderboard(data);
    } catch (err) {
      console.error('Erreur classement quiz:', err);
    }
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!token) {
          setLoading(false);
          fetchLeaderboard();
          return;
        }

        const res = await fetch(`${API}/quiz/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setQuiz(data);
        await fetchLeaderboard();
      } catch (err) {
        console.error('Erreur quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [token]);

  const currentQuestion = quiz?.questions?.[currentIndex];

  const handleValidate = async () => {
    if (selectedAnswer === null || !currentQuestion) return;

    try {
      setChecking(true);

      const res = await fetch(`${API}/quiz/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: currentQuestion._id,
          answer: selectedAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setInstantResult({
          error: true,
          message: data.message || 'Erreur lors de la vérification.',
        });
        return;
      }

      setAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion._id,
          answer: selectedAnswer,
        },
      ]);

      setInstantResult({
        isCorrect: data.isCorrect,
        correctAnswer: data.correctAnswer,
      });
    } catch (err) {
      console.error('Erreur check quiz:', err);
      setInstantResult({
        error: true,
        message: 'Erreur serveur.',
      });
    } finally {
      setChecking(false);
    }
  };

  const handleNext = async () => {
    const isLastQuestion = currentIndex === quiz.questions.length - 1;

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setInstantResult(null);
      return;
    }

    await submitFinalAnswers();
  };

  const submitFinalAnswers = async () => {
    try {
      setSending(true);

      const res = await fetch(`${API}/quiz/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFinalResult({
          error: true,
          message: data.message || 'Erreur lors de l’envoi du quiz.',
        });
        return;
      }

      setFinalResult(data);

      setQuiz((prev) => ({
        ...prev,
        alreadyAnswered: true,
        quizScore: data.quizScore,
        quizStreak: data.quizStreak,
        lastQuizResults: {
          correct: data.correctCount,
          total: data.total,
          pointsEarned: data.pointsEarned,
        },
      }));

      await fetchLeaderboard();
    } catch (err) {
      console.error('Erreur validation quiz:', err);
      setFinalResult({
        error: true,
        message: 'Erreur serveur.',
      });
    } finally {
      setSending(false);
    }
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    return '🥉';
  };

  if (!token) {
    return (
      <section className="quiz-widget">
        <div className="quiz-layout">
          <div className="quiz-left">
            <h2>🎮 Quiz Barça</h2>
            <p>Connecte-toi pour répondre au quiz du jour.</p>
          </div>
          <Leaderboard leaderboard={leaderboard} getMedal={getMedal} />
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="quiz-widget">
        <h2>🎮 Quiz Barça</h2>
        <p>Chargement du quiz...</p>
      </section>
    );
  }

  if (!quiz?.questions?.length) {
    return (
      <section className="quiz-widget">
        <div className="quiz-layout">
          <div className="quiz-left">
            <h2>🎮 Quiz Barça</h2>
            <p>Aucune question disponible.</p>
          </div>
          <Leaderboard leaderboard={leaderboard} getMedal={getMedal} />
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-widget">
      <div className="quiz-layout">
        <div className="quiz-left">
          <div className="quiz-header">
            <div>
              <span className="quiz-badge">Quiz du jour</span>
              <h2>🎮 Quiz Barça</h2>
            </div>

            <div className="quiz-score">
              <span>{quiz.quizScore || 0}</span>
              <small>points</small>
            </div>
          </div>

          <div className="quiz-stats">
            <span>🔥 Série : {quiz.quizStreak || 0}</span>
            <span>📌 5 questions / jour</span>
          </div>

          {quiz.alreadyAnswered || finalResult ? (
            <div className="quiz-result">
              <h3>Résultat du jour</h3>

              {finalResult ? (
                <>
                  <p>{finalResult.message}</p>
                  <small>
                    +{finalResult.pointsEarned} point(s) — Score total : {finalResult.quizScore}
                  </small>
                </>
              ) : (
                <>
                  <p>
                    {quiz.lastQuizResults?.correct || 0}/{quiz.lastQuizResults?.total || 5} bonnes réponses
                  </p>
                  <small>
                    +{quiz.lastQuizResults?.pointsEarned || 0} point(s) gagnés
                  </small>
                </>
              )}

              <p>Reviens demain pour un nouveau quiz.</p>
            </div>
          ) : (
            <>
              <div className="quiz-progress">
                Question {currentIndex + 1} / {quiz.questions.length}
              </div>

              <div className="quiz-stats">
                <span>📂 {currentQuestion.category}</span>
                <span>🎚️ {currentQuestion.difficulty}</span>
              </div>

              <p className="quiz-question">{currentQuestion.question}</p>

              {!instantResult ? (
                <>
                  <div className="quiz-buttons">
                    <button
                      type="button"
                      className={selectedAnswer === true ? 'active' : ''}
                      onClick={() => setSelectedAnswer(true)}
                    >
                      Vrai
                    </button>

                    <button
                      type="button"
                      className={selectedAnswer === false ? 'active' : ''}
                      onClick={() => setSelectedAnswer(false)}
                    >
                      Faux
                    </button>
                  </div>

                  <button
                    type="button"
                    className="quiz-submit"
                    onClick={handleValidate}
                    disabled={selectedAnswer === null || checking}
                  >
                    {checking ? 'Vérification...' : 'Valider'}
                  </button>
                </>
              ) : (
                <div className={instantResult.isCorrect ? 'quiz-feedback success' : 'quiz-feedback error'}>
                  {instantResult.error ? (
                    <p>{instantResult.message}</p>
                  ) : (
                    <>
                      <p>
                        {instantResult.isCorrect
                          ? '✅ Bonne réponse !'
                          : '❌ Mauvaise réponse.'}
                      </p>

                      {!instantResult.isCorrect && (
                        <small>
                          La bonne réponse était : {instantResult.correctAnswer ? 'Vrai' : 'Faux'}
                        </small>
                      )}
                    </>
                  )}

                  <button
                    type="button"
                    className="quiz-submit"
                    onClick={handleNext}
                    disabled={sending || instantResult.error}
                  >
                    {currentIndex === quiz.questions.length - 1
                      ? sending
                        ? 'Envoi...'
                        : 'Voir le résultat'
                      : 'Question suivante'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <Leaderboard leaderboard={leaderboard} getMedal={getMedal} />
      </div>
    </section>
  );
};

const Leaderboard = ({ leaderboard, getMedal }) => {
  return (
    <div className="quiz-leaderboard">
      <h3>🏆 Top 3</h3>

      {leaderboard.length === 0 ? (
        <p className="quiz-empty-ranking">Aucun score pour le moment.</p>
      ) : (
        <div className="quiz-ranking-list">
          {leaderboard.map((user, index) => (
            <div className="quiz-ranking-item" key={user._id}>
              <span className="quiz-medal">{getMedal(index)}</span>

              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="quiz-avatar"
              />

              <div>
                <strong>{user.username}</strong>
                <small>{user.quizScore} pts — série {user.quizStreak || 0}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizWidget;