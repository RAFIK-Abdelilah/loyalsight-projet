# LoyalSight — Simulateur de Programme de Fidélité Client

Projet personnel développé pour préparer une alternance **Data/IA chez Picard Surgelés**.
LoyalSight simule un pipeline complet de gestion de fidélité client avec les mêmes outils
et logiques utilisés en entreprise : CRM, RGPD, API REST et agent IA.

---

## Stack technique

| Couche           | Outil               | Version       |
|------------------|---------------------|---------------|
| Base de données  | PostgreSQL          | 15            |
| Backend          | Python FastAPI      | 3.11          |
| Frontend         | Angular             | 17            |
| Agent IA         | Python + OpenAI API | gpt-3.5-turbo |
| Containerisation | Docker Compose      | latest        |

---

## Structure du projet

```
loyalsight/
├── database/
│   ├── init.sql          → tables, vues PostgreSQL
│   └── seed.sql          → 10 clients fictifs français
├── backend/
│   ├── main.py           → point d'entrée FastAPI
│   ├── database.py       → connexion PostgreSQL psycopg2
│   ├── models/schemas.py → modèles Pydantic
│   └── routes/
│       ├── clients.py    → CRUD clients + stats dashboard
│       ├── points.py     → points fidélité + transactions
│       └── rgpd.py       → anonymisation et demandes RGPD
├── frontend/
│   └── src/app/
│       ├── pages/dashboard/   → KPIs + graphique segments
│       ├── pages/clients/     → tableau clients + filtre
│       ├── pages/client-detail/ → détail + historique
│       └── pages/rgpd/        → formulaire + anonymisation
├── ai_agent/
│   ├── agent.py          → agent SQL en langage naturel
│   └── prompts.py        → system prompt avec schéma BDD
└── docker-compose.yml    → PostgreSQL + backend
```

---

## Lancement du projet

### Avec Docker

```bash
docker-compose up --build
# Backend API → http://localhost:8000
# Swagger     → http://localhost:8000/docs
```

### Frontend Angular

```bash
cd frontend
npm install
ng serve
# Application → http://localhost:4200
```

### Agent IA

```bash
cd ai_agent
python agent.py
# Exemples : "Combien de clients GOLD ?"
#            "Les 3 clients avec le plus de points"
```

---

## Routes API

| Méthode | Route                            | Description                      |
|---------|----------------------------------|----------------------------------|
| GET     | /api/clients/                    | Liste tous les clients           |
| GET     | /api/clients/stats               | KPIs dashboard                   |
| GET     | /api/clients/{id}                | Détail d'un client               |
| POST    | /api/clients/                    | Créer un client                  |
| PUT     | /api/clients/{id}                | Modifier un client               |
| GET     | /api/points/{id}                 | Solde de points                  |
| POST    | /api/points/{id}/ajouter         | Ajouter des points               |
| POST    | /api/points/{id}/utiliser        | Utiliser des points              |
| GET     | /api/points/{id}/transactions    | Historique des transactions      |
| POST    | /api/rgpd/anonymiser/{id}        | Anonymiser un client             |
| GET     | /api/rgpd/demandes               | Liste des demandes RGPD          |
| GET     | /api/rgpd/qualite                | Statistiques qualité des données |

---

## Variables d'environnement

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loyalsight
DB_USER=postgres
DB_PASSWORD=postgres
OPENAI_API_KEY=sk-...
```

---

## Lien avec l'alternance Picard Surgelés

| Compétence Picard       | Simulation LoyalSight                                 |
|-------------------------|-------------------------------------------------------|
| Maxxing (CRM fidélité)  | API FastAPI avec CRUD clients et gestion des points   |
| RGPD                    | Module d'anonymisation et suivi des demandes          |
| PostgreSQL              | Base de données avec vues et contraintes d'intégrité  |
| APIs REST               | Backend FastAPI avec documentation Swagger intégrée   |
| IA / Copilot            | Agent SQL en langage naturel via OpenAI gpt-3.5-turbo |
| Angular (dashboard)     | SPA avec KPIs, liste clients, détail et RGPD          |
| Qualité des données     | Vue vue_qualite_donnees (doublons, manquants, etc.)   |
