const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { generateToken } = require("../utils/generateToken");
const { sendPasswordResetEmail } = require("../utils/emailService");

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });


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
    console.log('=== DEBUT forgotPassword ===');
    const { email } = req.body;
    console.log('Email reçu:', email);

    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User trouvé:', user ? 'OUI' : 'NON');
    
    if (!user) {
      console.log('Utilisateur non trouvé, retour message sécurisé');
      // Pour la sécurité, on renvoie toujours un message positif même si l'utilisateur n'existe pas
      return res.status(200).json({ 
        message: "Si cet email existe, un lien de réinitialisation a été envoyé" 
      });
    }

    // Générer un token de réinitialisation
    console.log('Génération du token...');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure
    console.log('Token généré:', resetToken.substring(0, 10) + '...');

    // Sauvegarder le token dans la base de données
    console.log('Sauvegarde du token en BDD...');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpiry: resetTokenExpiry,
      },
    });
    console.log('Token sauvegardé en BDD');

    // Envoyer l'email avec le lien de réinitialisation
    try {
      console.log('Tentative d\'envoi d\'email à:', email);
      await sendPasswordResetEmail(email, resetToken);
      console.log(`✅ Email de réinitialisation envoyé à ${email}`);
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', emailError);
      // On affiche le lien dans la console en cas d'erreur d'envoi
      console.log(`Lien de secours: http://localhost:5173/reset-password?token=${resetToken}`);
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
    console.log('=== DEBUT resetPassword ===');
    const { token, newPassword } = req.body;
    console.log('Token reçu:', token ? token.substring(0, 10) + '...' : 'AUCUN');
    console.log('Nouveau mot de passe reçu:', newPassword ? 'OUI' : 'NON');

    if (!token || !newPassword) {
      console.log('❌ Token ou mot de passe manquant');
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }

    // Hasher le token reçu pour le comparer
    console.log('Hashage du token...');
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Token hashé:', resetTokenHash.substring(0, 10) + '...');

    // Trouver l'utilisateur avec ce token valide
    console.log('Recherche utilisateur avec token valide...');
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpiry: {
          gt: new Date(), // Token non expiré
        },
      },
    });
    console.log('Utilisateur trouvé:', user ? 'OUI' : 'NON');

    if (!user) {
      console.log('❌ Token invalide ou expiré');
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    // Hasher le nouveau mot de passe
    console.log('Hashage du nouveau mot de passe...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Mot de passe hashé');

    // Mettre à jour le mot de passe et supprimer le token
    console.log('Mise à jour du mot de passe en BDD...');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });
    console.log('✅ Mot de passe mis à jour avec succès');

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
    console.log('=== FIN resetPassword ===');
  } catch (error) {
    console.error('❌ Erreur dans resetPassword:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
