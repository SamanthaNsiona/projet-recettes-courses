# 🚀 GUIDE D'INSTALLATION POUR LES COLLABORATEURS

## ⚡ Installation rapide (5 minutes)

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/SamanthaNsiona/projet-recettes-courses.git
cd projet-recettes-courses
```

### 2️⃣ Installer les dépendances

**Backend :**
```bash
cd backend
npm install
```

**Frontend :**
```bash
cd frontend
npm install
```

### 3️⃣ Configurer l'environnement

**Backend :**
- Copier `.env.shared` → `.env`
- Remplacer les valeurs par défaut (EMAIL_PASSWORD, HCAPTCHA_SECRET_KEY, JWT_SECRET)

**Frontend :**
- Copier `.env.shared` → `.env`

### 4️⃣ Lancer l'application

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Prisma Studio (optionnel) :**
```bash
cd backend
npx prisma studio
```

### ✅ C'est bon !
- Frontend : http://localhost:5174
- Backend : http://localhost:5000
- Prisma Studio : http://localhost:5555

---

## 📝 Variables à remplir dans `.env`

### Backend
- `JWT_SECRET` - Votre propre clé secrète (min 32 caractères)
- `EMAIL_PASSWORD` - Mot de passe Gmail (si vous envoyez des emails)
- `HCAPTCHA_SECRET_KEY` - Clé hCaptcha (si vous utilisez le captcha)

### Frontend
- `VITE_API_URL` - Déjà configuré : `http://localhost:5000/api`

---

## 🗄️ Base de données

- **Type** : PostgreSQL (Supabase)
- **Partage** : Tous les collaborateurs utilisent la MÊME base
- **Sync** : Les changements sont visibles en temps réel

---

## ❓ Problèmes ?

### "Port déjà utilisé"
```bash
# Chercher le processus
netstat -ano | findstr :5000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

### "Prisma erreur"
```bash
cd backend
npx prisma generate
```

### "Module not found"
```bash
npm install
```

---

## 📞 Contact
Demander au responsable du projet pour les identifiants secrets.
