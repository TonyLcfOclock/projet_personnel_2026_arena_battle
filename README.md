# Projet personnel 2026 - Arena Battle

Application web de combat tour par tour. Le joueur se connecte, choisit un personnage et lance un duel 1v1 contre un adversaire. Le moteur de combat gere tours, sorts, buffs, debuffs, effets negatifs et journaux de combat.

```
Démo Web: http://162.19.76.60/
Crédentials: Demo:password
```

## Fonctionnalites
- Authentification via JWT en cookie httpOnly (register, login, logout, session)
- Selection de personnages et demarrage de combat 1v1
- Moteur de combat cote serveur (cooldowns, passifs, buffs, debuffs, effets negatifs)
- Journaux de combat cote client
- Persistance PostgreSQL (utilisateurs et combats)

## Stack technique
- Frontend: Svelte 5 + Vite
- Backend: Node.js + Express
- Base de donnees: PostgreSQL + Sequelize

## Architecture et flux
- Le client Svelte appelle l'API via le proxy Vite (`/api` -> `http://localhost:3000`).
- Le serveur Express expose les routes d'auth, de selection et de combat.
- Les combats sont stockes dans PostgreSQL (state, turn, data serialize).

## Lancer en local
### Prerequis
- Node.js + npm
- PostgreSQL

### 1) Configurer les variables d'environnement
Creer un fichier `.env` ou renommer le fichier `.env.example` dans `server/`:

```env
PORT=express_port
PG_URL=postgres://user:password@server:port/database
JWT_SECRET=change_me
```

### 2) Installer et initialiser le serveur
```bash
cd server
npm install
npm run db:create
npm run dev
```

### 3) Installer et lancer le client
```bash
cd client
npm install
npm run dev
```

Ouvrir http://localhost:5173

## Scripts utiles
- `server`: `npm run db:create` (creer les tables), `npm run dev`
- `client`: `npm run dev`, `npm run build`, `npm run preview`

## API (extrait)
Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Selection:
- `GET /api/init`
- `POST /api/initialiseBattle`

Combat:
- `POST /api/battle/`
- `POST /api/battle/turn/`
- `POST /api/battle/reduce-character-spells-cd`
- `POST /api/battle/check-character-negative-effect`
- `POST /api/battle/check-character-buffs`
- `POST /api/battle/check-character-debuffs`
- `POST /api/battle/passive-per-turn`
- `POST /api/battle/determine-player-action`
- `POST /api/battle/determine-enemy-action`
- `POST /api/battle/character-use-spell`
- `POST /api/battle/check-character-alive`

## Structure du projet
```text
.
├─ client/                 # Svelte + Vite (UI)
├─ server/                 # Express + moteur de combat
├─ conception/             # MCD / MLD
└─ README.md
```

## Conception
- `conception/MCD.md`
- `conception/MLD.md`
