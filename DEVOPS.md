# Barçapp – Démarche DevOps & Déploiement

La démarche DevOps de Barçapp repose sur trois piliers :  
1) l’automatisation (CI/CD),  
2) la séparation front/back pour faciliter la scalabilité,  
3) l’utilisation d’environnements managés (Vercel, Render, MongoDB Atlas).

---

# 🚀 1. CI/CD avec GitHub Actions

À chaque `git push` ou `merge` dans la branche `main`, GitHub Actions déclenche un pipeline :

- récupération du code
- installation des dépendances
- build du frontend (React)
- déploiement automatique sur Vercel
- déploiement du backend sur Render (ou Railway)
- exécution de tests de base

Cela garantit que la version en production est toujours synchronisée avec la branche principale.

---

# 🌐 2. Architecture de déploiement

Barçapp utilise une architecture moderne, séparant les responsabilités :

- **Frontend (React)** → déployé sur **Vercel / CDN**
- **Backend (API Express)** → hébergé sur **Render**
- **Base de données** → **MongoDB Atlas**
- **Authentification** → **Auth0 (OIDC/JWT)**

Cette approche permet :
- une scalabilité indépendante (backend peut évoluer sans toucher au front)
- des temps de chargement minimisés via CDN
- une gestion sécurisée des secrets via les dashboards Vercel/Render

---

# 🔐 3. Gestion des variables d’environnement

Les secrets sont stockés dans les espaces sécurisés :
- Vercel : variables frontend (`REACT_APP_API_URL`, `GOOGLE_CLIENT_ID`)
- Render : variables backend (`JWT_SECRET`, `AUTH0_DOMAIN`, `MONGODB_URI`)
- MongoDB Atlas : cluster sécurisé TLS 1.2

Aucune donnée sensible n’est commitée dans GitHub.

---

# 📦 4. Workflow Git utilisé

- `main` → version stable, déployée automatiquement  
- `dev` → nouvelles fonctionnalités  
- Pull Requests → validation avant merge  
- Commits structurés → `feat:`, `fix:`, `docs:`, `refactor:`  

Ceci permet une collaboration fluide et traçable.

---

# 🛠️ 5. Monitoring & logs

- Logs serveur via Render (backend)
- Logs de build Vercel (frontend)
- Gestion des erreurs via `try/catch` et codes HTTP standard (401, 403, 500…)

---

# 🧩 6. Pourquoi cette démarche DevOps ?

- garantir une livraison continue (CI/CD)
- réduire les risques de bugs en production
- automatiser les déploiements pour gagner du temps
- améliorer la qualité, la sécurité et la stabilité du projet

---

# ✔️ Conclusion

Barçapp intègre une démarche DevOps complète :  
🔹 CI/CD automatisé,  
🔹 hébergement segmenté front/back,  
🔹 gestion propre des secrets,  
🔹 pipeline GitHub Actions,  
🔹 monitoring production.

Cela rend le projet professionnel, scalable, maintenable et moderne.
