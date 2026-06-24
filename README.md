# LoyalSight — Programme de fidélité client

Simulation complète d'un programme de fidélité client avec base de données PostgreSQL, API FastAPI, interface Angular et agent IA conversationnel (Groq).

---

## Prérequis

Avant de commencer, installe les outils suivants :

| Outil | Version minimale | Lien |
|---|---|---|
| Docker Desktop | 4.x | https://www.docker.com/products/docker-desktop |
| Node.js | 18.x | https://nodejs.org |
| Python | 3.11+ | https://www.python.org |

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/RAFIK-Abdelilah/loyalsight.git
cd loyalsight
```

### 2. Configurer les variables d'environnement

Crée le fichier `backend/.env` à partir de l'exemple suivant :

```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=loyalsight
DB_USER=postgres
DB_PASSWORD=postgres
GROQ_API_KEY=ta_cle_groq_ici
```

> **Clé Groq (gratuite)** : crée un compte sur [console.groq.com](https://console.groq.com), génère une clé API et remplace `ta_cle_groq_ici`.

---

## Lancement

### Étape 1 — Démarrer la base de données et le backend

```bash
docker-compose up --build -d
```

Docker va :
- Créer la base PostgreSQL avec toutes les tables
- Insérer automatiquement 110 clients fictifs (seed)
- Démarrer l'API FastAPI

Vérifie que tout tourne :

```bash
docker ps
```

Tu dois voir `loyalsight_db` (healthy) et `loyalsight_backend` (up).

| Service | URL |
|---|---|
| API FastAPI | http://localhost:8001 |
| Documentation API | http://localhost:8001/docs |
| PostgreSQL | localhost:5433 |

---

### Étape 2 — Démarrer le frontend Angular

```bash
cd frontend
npm install
npx ng serve
```

Ouvre ensuite : **http://localhost:4200**

---

### Étape 3 — Lancer l'agent IA (optionnel)

L'agent permet d'interroger la base en français naturel via Groq (LLM gratuit).

#### 3a. Obtenir une clé API Groq (gratuit) Ou OpenAI API si vous avez

1. Va sur **https://console.groq.com**
2. Crée un compte (Google ou email)
3. Clique sur **API Keys** → **Create API Key**
4. Copie la clé (commence par `gsk_...`)
5. Ouvre le fichier `backend/.env` et remplace `ta_cle_groq_ici` par ta clé :

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
Ou
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 3b. Lancer l'agent en ligne de commande

```bash
# Depuis la racine du projet

# Créer l'environnement virtuel (une seule fois)
python -m venv .venv

# Activer l'environnement
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

# Installer les dépendances
pip install groq psycopg2-binary python-dotenv

# Lancer l'agent
cd ai_agent
python agent.py
```

#### 3c. Exemples de questions

```
Combien de clients GOLD ?
Liste les 3 clients avec le plus de points
Quelles demandes RGPD sont en attente ?
Quel est le total des points distribués ?
Quels clients sont inscrits depuis plus de 3 ans ?
```

> L'agent est aussi accessible depuis l'interface web sur la page **Agent IA** (http://localhost:4200/agent) sans avoir à lancer le script Python.

---

## Structure du projet

```
loyalsight/
├── backend/          # API FastAPI (Python)
│   ├── routes/       # Endpoints clients, points, RGPD, agent IA
│   ├── models/       # Schémas Pydantic
│   ├── main.py
│   └── .env          # Variables d'environnement (à créer)
├── frontend/         # Interface Angular 17
│   └── src/app/
│       └── pages/    # Dashboard, Clients, RGPD, Agent IA
├── database/
│   ├── init.sql      # Création des tables
│   └── seed.sql      # 110 clients fictifs
├── ai_agent/         # Agent SQL en langage naturel
│   ├── agent.py
│   └── prompts.py
└── docker-compose.yml
```

---

## Pages disponibles

| Page | URL | Description |
|---|---|---|
| Dashboard | /dashboard | KPIs et répartition par segment |
| Clients | /clients | Liste des 110 clients avec filtre |
| Détail client | /clients/:id | Points, transactions, infos |
| RGPD | /rgpd | Demandes et anonymisation |
| Agent IA | /agent | SQL en langage naturel via Groq |

---

## Arrêter l'application

```bash
docker-compose down
```

Pour supprimer aussi les données :

```bash
docker-compose down -v
```
