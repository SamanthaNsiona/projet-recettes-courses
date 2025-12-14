# MyRecipes - Guide de Configuration

## 🚀 Configuration de l'environnement de développement

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/SamanthaNsiona/projet-recettes-courses.git
cd projet-recettes-courses
```

### 2️⃣ Configuration Backend

#### Installer les dépendances
```bash
cd backend
npm install
```

#### Configurer la base de données PostgreSQL

**Option A : Supabase (Recommandé - Gratuit)**
1. Créez un compte sur https://supabase.com
2. Créez un nouveau projet
3. Allez dans Settings > Database > Connection String
4. Copiez la connection string (format: `postgresql://...`)

**Option B : PostgreSQL local**
```bash
# Créez une base de données
createdb myrecipes

# Formatez la connection string
postgresql://user:password@localhost:5432/myrecipes
```

#### Créer le fichier `.env`
```bash
cp .env.example .env
```

Modifiez `.env` avec vos paramètres :
```
DATABASE_URL="votre_connection_string_postgresql"
JWT_SECRET="votre_secret_jwt"
EMAIL_USER="myrecipes@gmail.com"
EMAIL_PASSWORD="votre_app_password_gmail"
HCAPTCHA_SECRET_KEY="votre_cle_hcaptcha"
```

#### Générer le client Prisma et créer la base de données
```bash
npx prisma generate
npx prisma db push
```

#### Créer un utilisateur admin
```bash
node create-admin.js
```
**Résultat :**
- Email: `myrecipes@gmail.com`
- Mot de passe: `admin123`
- ⚠️ Changez ce mot de passe après la première connexion !

#### Lancer le backend
```bash
node server.js
# ou en mode développement
npm run dev
```

### 3️⃣ Configuration Frontend

#### Installer les dépendances
```bash
cd frontend
npm install
```

#### Lancer le frontend
```bash
npm run dev
```
L'application sera disponible sur `http://localhost:5173`

### 4️⃣ Configuration Email (Gmail)

1. Activez l'authentification à deux facteurs sur votre compte Google
2. Allez sur https://myaccount.google.com/apppasswords
3. Sélectionnez : App = Mail, Device = Windows Computer
4. Générez un mot de passe d'application
5. Copiez ce mot de passe dans `EMAIL_PASSWORD` du `.env`

### 5️⃣ Configuration hCaptcha

1. Créez un compte sur https://dashboard.hcaptcha.com/
2. Créez un nouveau site
3. Copiez la clé secrète dans `HCAPTCHA_SECRET_KEY` du `.env`

---

## 📋 Architecture du Projet

### Backend
- **Express.js** - Framework API REST
- **Prisma** - ORM pour PostgreSQL
- **JWT** - Authentification
- **Bcrypt** - Hash des mots de passe
- **Nodemailer** - Envoi d'emails
- **hCaptcha** - Protection contre les bots

### Frontend
- **React + Vite** - Interface utilisateur
- **React Router** - Navigation
- **Axios** - Requêtes API
- **Heroicons** - Icônes SVG
- **Pure CSS** - Styles sans Tailwind

---

## 🔐 Structure de la Base de Données

### Entités principales
1. **User** - Utilisateurs (USER/ADMIN)
2. **Recipe** - Recettes avec ingredients
3. **Ingredient** - Ingrédients des recettes
4. **ShoppingList** - Listes de courses
5. **ShoppingItem** - Articles des listes

---

## 👤 Rôles et Permissions

### USER
- ✅ Créer/lire/modifier/supprimer ses propres recettes
- ✅ Voir les recettes publiques
- ✅ Gérer ses listes de courses
- ✅ Éditer son profil

### ADMIN
- ✅ Accès au Dashboard Admin
- ✅ Voir toutes les recettes
- ✅ Voir tous les utilisateurs
- ✅ Changer les rôles des utilisateurs
- ✅ Supprimer des recettes/utilisateurs
- ✅ Accéder aux statistiques globales

---

## 🧪 Endpoints API principales

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/forgot-password` - Réinitialisation mot de passe

### Recettes
- `GET /api/recipes/public` - Toutes les recettes publiques
- `GET /api/recipes` - Mes recettes
- `POST /api/recipes` - Créer une recette
- `PUT /api/recipes/:id` - Modifier une recette
- `DELETE /api/recipes/:id` - Supprimer une recette

### Listes de courses
- `GET /api/shopping-lists` - Mes listes
- `POST /api/shopping-lists` - Créer une liste
- `PUT /api/shopping-lists/:id` - Modifier une liste
- `DELETE /api/shopping-lists/:id` - Supprimer une liste

### Admin
- `GET /api/admin/stats` - Statistiques globales
- `GET /api/admin/users` - Tous les utilisateurs
- `GET /api/admin/recipes` - Toutes les recettes
- `PUT /api/admin/users/:id/role` - Changer le rôle
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur
- `DELETE /api/admin/recipes/:id` - Supprimer une recette

---

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que `DATABASE_URL` est correcte
- Vérifiez que le serveur PostgreSQL est actif
- Pour Supabase, vérifiez les pare-feu

### Erreur d'authentification email
- Vérifiez que vous avez généré un App Password Gmail
- Vérifiez que 2FA est activé sur votre compte Google

### Erreur Prisma
```bash
# Régénérer le client Prisma
npx prisma generate

# Réinitialiser la base de données (⚠️ Supprime toutes les données)
npx prisma migrate reset
```

---

## 📞 Support

Pour les collaborateurs : Contactez l'administrateur du projet
