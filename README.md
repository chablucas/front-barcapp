# Barçapp – Frontend (React)

Barçapp est une application web type YouTube dédiée au FC Barcelone.  
Ce dépôt contient **le frontend** de l’application, développé en **React** sous forme de **SPA (Single Page Application)**.

---

## 🎯 Objectifs du frontend

- Afficher les résumés de matchs et vidéos liés au FC Barcelone (layout façon YouTube).
- Proposer une expérience utilisateur aux couleurs du Barça (bleu, grana, jaune).
- Permettre à l’utilisateur de :
  - s’inscrire / se connecter (email + Google OAuth2),
  - liker / disliker des vidéos,
  - ajouter des vidéos en favoris,
  - commenter des vidéos,
  - consulter ses informations dans une page **Profil**.

---

## 🧩 Stack technique

- **React** (SPA)
- **react-router-dom** pour la navigation
- **Axios** pour les appels API
- **Context API / Hooks** (`useState`, `useEffect`, `useContext`, `useNavigate`) pour la gestion d’état
- **JWT** côté frontend (stockage du token + décodage avec `jwt-decode`)
- **CSS personnalisé** (thème FC Barcelone)

> Le frontend consomme une API REST exposée par le backend Node.js / Express.

---

## 📁 Pages principales

- **Accueil** : liste des vidéos, filtres, layout type YouTube.
- **Shorts** : affichage des vidéos marquées `isShort = true`.
- **Détail d’une vidéo** : lecteur, likes/dislikes, commentaires.
- **Profil** : infos utilisateur, favoris, vidéos likées, avatar, bannière.
- **Admin** (si rôle `admin`) : gestion des vidéos et widgets (match en direct, série de victoires, etc.).
- **Login / Register** : connexion classique + bouton *Se connecter avec Google*.

---

## ⚙️ Prérequis

- **Node.js** (version LTS recommandée)
- **npm** ou **yarn**
- Une URL d’API backend fonctionnelle (Render, localhost…)
- Les variables d’environnement correctement configurées (ex. URL de l’API).

---

## 🚀 Installation & démarrage

```bash
# Cloner le dépôt
git clone https://github.com/TON_COMPTE/barcapp-frontend.git
cd barcapp-frontend

# Installer les dépendances
npm install

# Lancer l’application en mode développement
npm start
