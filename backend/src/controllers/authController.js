const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require("axios");
const { generateToken } = require("../utils/generateToken");
const { sendPasswordResetEmail } = require("../utils/emailService");

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { name, email, password, role, captchaToken } = req.body;

    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📝 NOUVELLE INSCRIPTION');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✉️  Email:', email);
    console.log('👤 Nom:', name);
    console.log('🎫 Captcha: ✅ VALIDÉ PAR MIDDLEWARE');
    console.log('═══════════════════════════════════════════════════════════\n');

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

    console.log('════════════════════════════════════════════════════════════');
    console.log('✅ INSCRIPTION RÉUSSIE');
    console.log('════════════════════════════════════════════════════════════');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('════════════════════════════════════════════════════════════\n');

    res.status(201).json({
      message: "Utilisateur créé",
      user: safeUser,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('\n════════════════════════════════════════════════════════════');
    console.log('🔐 TENTATIVE DE CONNEXION');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📧 Email:', email);
    console.log('🔑 Mot de passe reçu:', password ? '***' + password.slice(-3) : 'vide');

    // Validation des entrées
    if (!email || !password) {
      console.log('❌ Validation échouée: champs manquants');
      console.log('════════════════════════════════════════════════════════════\n');
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    console.log('👤 Utilisateur trouvé:', user ? 'OUI' : 'NON');
    if (user) {
      console.log('   ID:', user.id);
      console.log('   Rôle:', user.role);
      console.log('   Hash en DB:', user.password ? user.password.substring(0, 20) + '...' : 'vide');
    }
    
    // Protection contre les attaques par timing - toujours comparer même si user inexistant
    const isMatch = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, "$2a$10$dummy.hash.to.prevent.timing.attack");
    
    console.log('🔍 Comparaison mot de passe:', isMatch ? '✅ MATCH' : '❌ PAS DE MATCH');
    
    if (!user || !isMatch) {
      console.log('❌ CONNEXION REFUSÉE');
      console.log('════════════════════════════════════════════════════════════\n');
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }


    const { password: _, ...safeUser } = user;

    console.log('✅ CONNEXION RÉUSSIE');
    console.log('🎫 Token généré avec role:', user.role);
    console.log('════════════════════════════════════════════════════════════\n');

    res.status(200).json({
      message: "Connexion réussie",
      user: safeUser,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.log('💥 ERREUR SERVEUR:', error.message);
    console.log('════════════════════════════════════════════════════════════\n');
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
    
    console.log('🔐 Réinitialisation mot de passe pour:', user.email);
    console.log('🔐 Nouveau hash généré (longueur):', hashedPassword.length);

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });
    
    console.log('✅ Mot de passe mis à jour en base de données');

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error('Erreur dans resetPassword:', error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer l'utilisateur actuel (basé sur le JWT)
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // Défini par le middleware authMiddleware
    
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur dans getCurrentUser:', error);
    res.status(500).json({ error: error.message });
  }
};

// Changer le mot de passe (utilisateur connecté)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Mot de passe actuel et nouveau requis" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Le nouveau mot de passe doit contenir au moins 6 caractères" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe actuel incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: "Mot de passe changé avec succès" });
  } catch (error) {
    console.error('Erreur dans changePassword:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer le compte utilisateur
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    console.error('Erreur dans deleteAccount:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword, getCurrentUser, changePassword, deleteAccount };
