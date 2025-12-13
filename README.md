

# Application « MyRecipe »



## Présentation du projet

Ce projet est une application web permettant aux utilisateurs de créer, gérer et organiser des recettes ainsi que leurs ingrédients.

Les utilisateurs peuvent :

* consulter des recettes publiques
* gérer leurs propres recettes de manière privée

Un rôle administrateur est mis en place afin de superviser les données globales de l’application et d’effectuer des actions supplémentaires réservées à l’administration.



## Équipe et organisation du travail

L’équipe est composée de :

* Soumeya Hameur
* Pauline Liu
* Samantha Nsiona

Chaque membre du groupe a travaillé sur :

* le backend (API, sécurité, logique métier)
* le frontend (React, composants, appels API)



## Fonctionnalités

### Utilisateur (USER)

* Inscription et connexion
* Création, modification et suppression de ses propres recettes
* Consultation des recettes publiques
* Gestion des ingrédients associés aux recettes
* Accès strictement limité à ses propres données

### Administrateur (ADMIN)

* Accès à l’ensemble des recettes
* Suppression de recettes
* Gestion globale des ingrédients
* Supervision des données de l’application



## Gestion des rôles et sécurité

L’application implémente un système d’authentification et d’autorisation sécurisé.

Authentification basée sur des tokens JWT

Deux rôles définis :

USER

ADMIN

Les droits sont vérifiés côté backend

Des mesures de sécurité supplémentaires ont été mises en place :

* Utilisation d’un rate limiter afin de limiter le nombre de requêtes et prévenir les tentatives d’abus

* Intégration d’un CAPTCHA lors de l’inscription, afin de limiter les créations de comptes automatisées

Un utilisateur ne peut pas :

* Modifier ou supprimer une recette qui ne lui appartient pas

* Accéder aux données privées d’un autre utilisateur

Les routes administrateur sont protégées par des middlewares spécifiques.



## Architecture de l’API

L’API respecte une logique RESTful claire et cohérente.

### Entités principales

* Recipe
* Ingredient
* User (non comptée dans les entités demandées)

Les relations entre recettes et ingrédients sont gérées côté backend.

### Exemples de routes

```
GET     /api/recipes
POST    /api/recipes
PUT     /api/recipes/:id
DELETE  /api/recipes/:id

GET     /api/ingredients
POST    /api/ingredients
```

---

## Frontend (React)

Le frontend est développé avec React et Vite.

### Composant générique

Un composant générique réutilisable est utilisé pour :

* l’affichage des recettes
* l’affichage des ingrédients
* certaines vues administrateur

Ce composant est paramétré via des props afin de s’adapter aux différents contextes d’utilisation.

### Interface adaptée selon le rôle

* Certaines actions sont visibles uniquement pour les administrateurs
* Les routes sensibles sont protégées côté frontend
* L’interface s’adapte dynamiquement selon le rôle de l’utilisateur connecté


## Restrictions d’accès

* Un utilisateur peut uniquement modifier ou supprimer ses propres recettes
* Les recettes publiques sont accessibles à tous les utilisateurs
* Les recettes privées sont accessibles uniquement à leur propriétaire ou à un administrateur
* Les fonctionnalités administrateur sont inaccessibles aux utilisateurs classiques


## Procédure de lancement du projet

### Backend

```
git clone https://github.com/SamanthaNsiona/projet-recettes-courses.git
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```



## Vidéo de démonstration

Lien vers la vidéo de démonstration :



## Organisation du repository

```
/
├── backend/
│   ├── routes
│   ├── controllers
│   ├── middleware
│   └── services
├── frontend/
│   ├── components
│   ├── pages
│   └── services
└── README.md
```



## Technologies utilisées

* Backend : Node.js, Express
* Frontend : React (Vite)
* Authentification : JWT
* Outils : GitHub



## Contraintes respectées

* API RESTful conforme
* Minimum de trois entités métier (hors User)
* Gestion réelle des rôles et des droits
* Composant générique réutilisé
* Interface adaptée selon le rôle
* Utilisation de Git avec commits individuels
* Participation de chaque membre au front et au back



