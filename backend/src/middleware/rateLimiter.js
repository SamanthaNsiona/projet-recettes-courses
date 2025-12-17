const rateLimit = require('express-rate-limit');

// Rate limiter pour les tentatives de connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 tentatives
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour l'inscription
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Maximum 3 inscriptions par heure par IP
  message: {
    error: 'Trop de tentatives d\'inscription. Veuillez réessayer dans 1 heure.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour les requêtes API générales
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Maximum 500 requêtes par 15 minutes (augmenté pour le dev)
  message: {
    error: 'Trop de requêtes. Veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour le reset de mot de passe
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Maximum 3 demandes de reset par heure
  message: {
    error: 'Trop de demandes de réinitialisation. Veuillez réessayer dans 1 heure.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  registerLimiter,
  apiLimiter,
  passwordResetLimiter
};

