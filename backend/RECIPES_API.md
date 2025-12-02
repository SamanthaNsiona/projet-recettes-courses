# 🍽️ Backend - Gestion des Recettes

Ce document explique comment utiliser l'API pour gérer les recettes et leurs ingrédients.

## 📚 Structure des Endpoints

### 🔐 Authentication
```
POST /api/auth/register    - Créer un compte
POST /api/auth/login       - Se connecter
```

### 🍽️ Recettes
```
POST   /api/recipes                    - Créer une recette
GET    /api/recipes                    - Voir toutes mes recettes
GET    /api/recipes/:id                - Voir une recette spécifique
PUT    /api/recipes/:id                - Modifier une recette
DELETE /api/recipes/:id                - Supprimer une recette
```

### 📋 Ingrédients
```
POST   /api/recipes/:recipeId/ingredients              - Ajouter un ingrédient
GET    /api/recipes/:recipeId/ingredients              - Voir les ingrédients
GET    /api/recipes/:recipeId/ingredients/:ingredientId - Voir un ingrédient
PUT    /api/recipes/:recipeId/ingredients/:ingredientId - Modifier un ingrédient
DELETE /api/recipes/:recipeId/ingredients/:ingredientId - Supprimer un ingrédient
```

## 🚀 Lancer le serveur

```bash
cd backend
npm install
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 🧪 Tester l'API

```bash
node test-recipes.js
```

## 📝 Exemples d'utilisation

### 1️⃣ S'inscrire
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2️⃣ Créer une recette
```bash
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Pâtes Carbonara",
    "description": "Délicieuse recette italienne",
    "isPublic": false
  }'
```

### 3️⃣ Ajouter un ingrédient
```bash
curl -X POST http://localhost:5000/api/recipes/1/ingredients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Pâtes",
    "unit": "g",
    "quantity": 400
  }'
```

### 4️⃣ Récupérer une recette avec ses ingrédients
```bash
curl -X GET http://localhost:5000/api/recipes/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Réponse:
```json
{
  "id": 1,
  "title": "Pâtes Carbonara",
  "description": "Délicieuse recette italienne",
  "isPublic": false,
  "userId": 1,
  "ingredients": [
    {
      "id": 1,
      "name": "Pâtes",
      "unit": "g",
      "quantity": 400,
      "recipeId": 1
    },
    {
      "id": 2,
      "name": "Œufs",
      "unit": "pièce",
      "quantity": 4,
      "recipeId": 1
    }
  ]
}
```

### 5️⃣ Modifier une recette
```bash
curl -X PUT http://localhost:5000/api/recipes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Pâtes Carbonara Perfectionnées",
    "description": "La meilleure recette carbonara!",
    "isPublic": true
  }'
```

### 6️⃣ Supprimer un ingrédient
```bash
curl -X DELETE http://localhost:5000/api/recipes/1/ingredients/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7️⃣ Supprimer une recette (supprime aussi les ingrédients)
```bash
curl -X DELETE http://localhost:5000/api/recipes/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔐 Sécurité

✅ **Authentification obligatoire** - Tous les endpoints (sauf register/login) nécessitent un token
✅ **Vérification de propriété** - Vous ne pouvez modifier/supprimer que vos propres recettes
✅ **Ingrédients liés** - Les ingrédients sont supprimés automatiquement avec la recette
✅ **Validation des données** - Les champs obligatoires sont vérifiés

## 📊 Modèle de données

```
User
├── id (Int)
├── name (String)
├── email (String, unique)
├── password (String)
├── role (String, default: "USER")
├── recipes (Recipe[])
└── ingredients (Ingredient[])

Recipe
├── id (Int)
├── title (String)
├── description (String?)
├── isPublic (Boolean, default: false)
├── userId (Int, FK)
├── user (User)
└── ingredients (Ingredient[])

Ingredient
├── id (Int)
├── name (String)
├── unit (String?)
├── quantity (Float?)
├── recipeId (Int?, FK)
├── recipe (Recipe?)
├── userId (Int?, FK)
└── user (User?)
```

## ⚡ Fonctionnalités

- ✅ CRUD complet pour les recettes
- ✅ CRUD complet pour les ingrédients
- ✅ Authentification JWT
- ✅ Vérification de propriété des données
- ✅ Validation des inputs
- ✅ Gestion automatique des relations
- ✅ Messages d'erreur clairs
- ✅ Codes HTTP appropriés

## 🚨 Messages d'erreur

| Code | Message | Signification |
|------|---------|---------------|
| 400 | "Le titre de la recette est requis" | Données manquantes |
| 403 | "Vous n'avez pas accès à cette recette" | Pas propriétaire |
| 404 | "Recette non trouvée" | Ressource inexistante |
| 500 | Erreur serveur | Problème interne |

## 💡 Tips

- Toujours inclure le header `Authorization: Bearer TOKEN`
- Les ingrédients ne peuvent être accédés que si vous possédez la recette
- `isPublic: true` permet de partager les recettes (À implémenter au front)
- La suppression d'une recette supprime automatiquement ses ingrédients
