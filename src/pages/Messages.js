import React, { useEffect, useState, useCallback } from 'react';
import './Messages.css';

const API = 'https://back-barcapp.onrender.com/api';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchConversations = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur conversations');
      }

      setConversations(data);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);

    try {
      const res = await fetch(`${API}/conversations/${conversation._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur messages');
      }

      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const sendMessage = async () => {
    if (!content.trim() || !activeConversation) return;

    try {
      const res = await fetch(`${API}/conversations/${activeConversation._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur envoi message');
      }

      setMessages((prev) => [...prev, data]);
      setContent('');
      fetchConversations();
    } catch (err) {
      setError(err.message);
    }
  };

  const getOtherUser = (conversation) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    return conversation.participants?.find((p) => p._id !== currentUser?._id);
  };

  return (
    <div className="messages-page">
      <div className="messages-sidebar">
        <h2>Messages</h2>

        {error && <p className="messages-error">{error}</p>}

        {conversations.length === 0 ? (
          <p className="messages-empty">Aucune conversation.</p>
        ) : (
          conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation);

            return (
              <button
                key={conversation._id}
                className={`conversation-card ${
                  activeConversation?._id === conversation._id ? 'active' : ''
                }`}
                onClick={() => openConversation(conversation)}
              >
                <img
                  src={otherUser?.avatar || 'https://via.placeholder.com/50'}
                  alt={otherUser?.username || 'Utilisateur'}
                />

                <div>
                  <strong>{otherUser?.username || 'Utilisateur'}</strong>
                  <span>{conversation.lastMessage || 'Nouvelle conversation'}</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="messages-chat">
        {!activeConversation ? (
          <div className="messages-placeholder">
            <h3>Sélectionne une discussion</h3>
            <p>Choisis une conversation à gauche pour commencer.</p>
          </div>
        ) : (
          <>
            <div className="messages-chat-header">
              <h3>{getOtherUser(activeConversation)?.username}</h3>
            </div>

            <div className="messages-list">
              {messages.map((message) => {
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const isMine =
                  message.sender?._id === currentUser?._id ||
                  message.sender === currentUser?._id;

                return (
                  <div
                    key={message._id}
                    className={`message-bubble ${isMine ? 'mine' : 'other'}`}
                  >
                    <p>{message.content}</p>
                  </div>
                );
              })}
            </div>

            <div className="message-input-bar">
              <input
                type="text"
                placeholder="Écris ton message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
              />

              <button onClick={sendMessage}>Envoyer</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;