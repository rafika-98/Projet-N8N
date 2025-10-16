# Le Gourmet du Sahel

Application web complète (FastAPI + React) pour le restaurant **Le Gourmet du Sahel** basé à Niamey.

## Fonctionnalités

- Consultation du menu (10 plats ouest-africains) avec filtre par catégorie.
- Réservation de table avec enregistrement en base MongoDB.
- Commande à emporter avec panier côté client et stockage des commandes.
- Authentification JWT (inscription/connexion) et rôle administrateur.
- Tableau de bord administrateur pour gérer le menu, suivre les réservations et commandes.
- Page contact avec coordonnées et carte Google Maps intégrée.
- Conteneurisation via Docker Compose (frontend, backend, MongoDB).

## Architecture

```
/backend
  core/        # configuration, sécurité et connexion MongoDB
  models/      # schémas Pydantic pour utilisateurs, plats, réservations, commandes
  routes/      # routes FastAPI (auth, menu, réservations, commandes)
  main.py      # application principale FastAPI avec seed des données
/frontend
  src/
    components/  # Navbar, Footer, cartes de plats, formulaires
    pages/       # Home, Menu, Reservation, Contact, AdminDashboard
    context/     # AuthContext pour gérer JWT côté client
  Dockerfile
```

## Pré-requis

- Docker & Docker Compose installés.

## Installation & lancement

```bash
docker-compose build
docker-compose up
```

- Frontend accessible sur [http://localhost:3000](http://localhost:3000)
- API FastAPI sur [http://localhost:8000/docs](http://localhost:8000/docs)
- MongoDB exposé sur `mongodb://localhost:27017`

## Comptes & données de départ

- Administrateur : `admin@legourmet.com` / `Admin123!`
- 10 plats ouest-africains automatiquement insérés au démarrage de l'API.

## Variables d'environnement

Les variables peuvent être surchargées via `docker-compose.yml` ou un fichier `.env` dans `/backend` :

- `MONGO_URL` – URL de connexion MongoDB (par défaut `mongodb://mongo:27017`).
- `MONGO_DB` – nom de la base (`gourmet_db`).
- `JWT_SECRET_KEY` – clé secrète JWT.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` – identifiants de l'admin seedé.

## Développement local (optionnel)

Backend :

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend :

```bash
cd frontend
npm install
npm run dev
```

Assurez-vous qu'une instance MongoDB tourne en local (ex : `docker run -p 27017:27017 mongo`).
