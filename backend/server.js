const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { router: authRoutes } = require("./src/routes/authRoutes");
const recipeRoutes = require("./src/routes/recipeRoutes");
const { protect } = require("./src/middleware/authMiddleware");
const { apiLimiter } = require("./src/middleware/rateLimiter");
const { verifyHCaptchaMiddleware } = require("./src/middleware/hcaptchaMiddleware");

const shoppingListRoutes = require("./src/routes/shoppingListRoutes");
const shoppingItemRoutes = require("./src/routes/shoppingItemRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const testRoutes = require("./src/routes/testRoutes");

dotenv.config();

// Vérifier que les variables d'environnement email sont définies
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('ERREUR: Variables EMAIL_USER et EMAIL_PASSWORD doivent être définies dans le fichier .env');
  console.error('Consultez le fichier .env.example pour voir un exemple de configuration');
  process.exit(1);
}

console.log('Variables EMAIL chargées:', {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: '***'
});

const app = express();

app.use(cors());
app.use(express.json());

// Appliquer le rate limiter global sur toutes les routes API
app.use('/api/', apiLimiter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: "API Recettes & Courses OK" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/shopping-lists", shoppingListRoutes);
app.use("/api/shopping-items", shoppingItemRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/test", testRoutes);

// Test hCaptcha endpoint
app.post("/api/verify-captcha", verifyHCaptchaMiddleware, (req, res) => {
  res.json({ message: "✅ Captcha valide!" });
});

app.get("/api/test", protect, (req, res) => {
  res.json({ message: "Route protégée OK ", user: req.user });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('ERREUR SERVEUR:', err);
  res.status(500).json({ message: err.message });
});

async function verifyHCaptcha(req, res, next) {
  const token = req.body.captchaToken;
  
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('🔐 VÉRIFICATION HCAPTCHA - SERVEUR');
  console.log('════════════════════════════════════════════════════════════');
  console.log('🎫 Token reçu:', token ? token.substring(0, 30) + '...' : '❌ AUCUN');
  console.log('🔑 Secret Key:', process.env.HCAPTCHA_SECRET_KEY);
  console.log('════════════════════════════════════════════════════════════\n');

  if (!token) {
    console.log('❌ Token manquant');
    return res.status(400).json({ error: "Captcha manquant" });
  }

  try {
    console.log('📡 Envoi à hCaptcha.com...');
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${token}`
    });

    const data = await response.json();
    console.log('✅ Réponse de hCaptcha:', JSON.stringify(data, null, 2));

    if (!data.success) {
      console.log('❌ Captcha invalide');
      return res.status(400).json({ error: "Captcha invalide" });
    }

    console.log('✅ Captcha valide - Passage à next()');
    console.log('════════════════════════════════════════════════════════════\n');
    next();

    next();
  } catch (err) {
    console.error("Erreur hCaptcha :", err);
    return res.status(500).json({ error: "Erreur lors de la vérification captcha" });
  }
}

// Gestion des erreurs non gérées - EMPÊCHER LE CRASH
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION (serveur continue):', err);
  // Ne pas terminer le processus
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION (serveur continue):', err);
  // Ne pas terminer le processus
});

// Empêcher la fermeture du serveur
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu - IGNORÉ');
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu - IGNORÉ');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Email:', process.env.EMAIL_USER);
});

// Garder le processus actif
setInterval(() => {
  // Heartbeat pour garder le serveur vivant
}, 60000);
