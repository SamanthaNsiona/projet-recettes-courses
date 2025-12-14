#!/bin/bash

echo "========================================="
echo "🚀 Setup MyRecipes - Installation"
echo "========================================="
echo ""

# Backend setup
echo "📦 Installation des dépendances backend..."
cd backend
npm install
echo "✅ Backend dépendances installées"
echo ""

# Prisma generation
echo "🔧 Génération du client Prisma..."
npx prisma generate
echo "✅ Client Prisma généré"
echo ""

# Frontend setup
echo "📦 Installation des dépendances frontend..."
cd ../frontend
npm install
echo "✅ Frontend dépendances installées"
echo ""

cd ..

echo "========================================="
echo "✅ Installation terminée !"
echo "========================================="
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez le fichier backend/.env"
echo "2. Lancez: npm run dev (ou npm run dev:backend et npm run dev:frontend)"
echo "3. Accédez à http://localhost:5173"
echo ""
echo "👤 Admin par défaut :"
echo "   Email: myrecipes@gmail.com"
echo "   Mot de passe: admin123"
echo ""
echo "⚠️  Changez le mot de passe admin après la première connexion !"
echo ""
