import React, { useEffect, useState } from 'react';
import './QuizWidget.css';

const API = 'https://back-barcapp.onrender.com/api';

const QuizWidget = () => {
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTodayQuiz = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API}/quiz/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        console.error('Erreur quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayQuiz();
  }, [token]);

  const handleSubmit = async () => {
    if (selectedAnswer === null || !quiz?.question?._id) return;

    try {
      setSending(true);

      const res = await fetch(`${API}/quiz/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: quiz.question._id,
          answer: selectedAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({
          error: true,
          message: data.message || 'Erreur lors de la réponse.',
        });
        return;
      }

      setResult(data);
      setQuiz((prev) => ({
        ...prev,
        alreadyAnswered: true,
        quizScore: data.quizScore,
        quizStreak: data.quizStreak,
        lastQuizCorrect: data.isCorrect,
      }));
    } catch (err) {
      console.error('Erreur validation quiz:', err);
      setResult({
        error: true,
        message: 'Erreur serveur.',
      });
    } finally {
      setSending(false);
    }
  };

  if (!token) {
    return (
      <section className="quiz-widget">
        <h2>🎮 Quiz Barça</h2>
        <p>Connecte-toi pour répondre à la question du jour.</p>
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

  if (!quiz?.question) {
    return (
      <section className="quiz-widget">
        <h2>🎮 Quiz Barça</h2>
        <p>Aucune question disponible pour le moment.</p>
      </section>
    );
  }

  return (
    <section className="quiz-widget">
      <div className="quiz-header">
        <div>
          <span className="quiz-badge">Question du jour</span>
          <h2>🎮 Quiz Barça</h2>
        </div>

        <div className="quiz-score">
          <span>{quiz.quizScore || 0}</span>
          <small>points</small>
        </div>
      </div>

      <div className="quiz-stats">
        <span>🔥 Série : {quiz.quizStreak || 0}</span>
        <span>📂 {quiz.question.category}</span>
      </div>

      <p className="quiz-question">{quiz.question.question}</p>

      {quiz.alreadyAnswered ? (
        <div className="quiz-result">
          <p>
            {quiz.lastQuizCorrect
              ? '✅ Tu as déjà répondu correctement aujourd’hui.'
              : '❌ Tu as déjà répondu aujourd’hui.'}
          </p>
          <small>Reviens demain pour une nouvelle question.</small>
        </div>
      ) : (
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
            onClick={handleSubmit}
            disabled={selectedAnswer === null || sending}
          >
            {sending ? 'Validation...' : 'Valider'}
          </button>
        </>
      )}

      {result && (
        <div className={result.isCorrect ? 'quiz-feedback success' : 'quiz-feedback error'}>
          <p>{result.message}</p>

          {!result.error && (
            <small>
              Score : {result.quizScore} point(s) — Série : {result.quizStreak}
            </small>
          )}
        </div>
      )}
    </section>
  );
};

export default QuizWidget;