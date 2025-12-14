@echo off
setlocal enabledelayedexpansion

echo.
echo =========================================
echo 🚀 Setup MyRecipes - Installation
echo =========================================
echo.

REM Backend setup
echo 📦 Installation des dépendances backend...
cd backend
call npm install
if errorlevel 1 (
  echo ❌ Erreur installation backend
  exit /b 1
)
echo ✅ Backend dépendances installées
echo.

REM Prisma generation
echo 🔧 Génération du client Prisma...
call npx prisma generate
if errorlevel 1 (
  echo ❌ Erreur génération Prisma
  exit /b 1
)
echo ✅ Client Prisma généré
echo.

REM Frontend setup
echo 📦 Installation des dépendances frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
  echo ❌ Erreur installation frontend
  exit /b 1
)
echo ✅ Frontend dépendances installées
echo.

cd ..

echo.
echo =========================================
echo ✅ Installation terminée !
echo =========================================
echo.
echo 📋 Prochaines étapes :
echo 1. Configurez le fichier backend\.env
echo 2. Lancez: npm run dev
echo 3. Accédez à http://localhost:5173
echo.
echo 👤 Admin par défaut :
echo    Email: myrecipes@gmail.com
echo    Mot de passe: admin123
echo.
echo ⚠️  Changez le mot de passe admin après la première connexion !
echo.
pause
