const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { generateToken } = require("../utils/generateToken");
const { sendPasswordResetEmail } = require("../utils/emailService");

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation des entrées
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    
    const { password: _, ...safeUser } = user;

    res.status(201).json({
      message: "Utilisateur créé",
      user: safeUser,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des entrées
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    // Protection contre les attaques par timing - toujours comparer même si user inexistant
    const isMatch = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, "$2a$10$dummy.hash.to.prevent.timing.attack");
    
    if (!user || !isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }


    const { password: _, ...safeUser } = user;

    res.status(200).json({
      message: "Connexion réussie",
      user: safeUser,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Demande de réinitialisation de mot de passe
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validation de l'email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Pour la sécurité, on renvoie toujours un message positif même si l'utilisateur n'existe pas
      return res.status(200).json({ 
        message: "Si cet email existe, un lien de réinitialisation a été envoyé" 
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token dans la base de données
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpiry: resetTokenExpiry,
      },
    });

    // Envoyer l'email avec le lien de réinitialisation
    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log(`Email de réinitialisation envoyé à ${email}`);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email');
      // Ne PAS afficher le token en production
      if (process.env.NODE_ENV === 'development') {
        console.log(`Lien de dev: http://localhost:5173/reset-password?token=${resetToken}`);
      }
    }

    res.status(200).json({ 
      message: "Si cet email existe, un lien de réinitialisation a été envoyé" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }

    // Validation du mot de passe
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    // Hasher le token reçu pour le comparer
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Trouver l'utilisateur avec ce token valide
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpiry: {
          gt: new Date(), // Token non expiré
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error('Erreur dans resetPassword:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
