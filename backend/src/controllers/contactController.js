const { sendContactEmail } = require('../utils/emailService');
const { saveContactMessage, getAllContactMessages } = require('../utils/contactLogger');
const prisma = require('../utils/prismaClient');

// Envoyer un message de contact
const sendContact = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user.id; // Récupéré depuis le middleware protect

    console.log('==============================================');
    console.log('📨 NOUVELLE DEMANDE DE CONTACT');
    console.log('==============================================');
    console.log('User ID:', userId);
    console.log('Subject:', subject);
    console.log('Message:', message);

    if (!subject || !message) {
      console.log(' Erreur: Sujet ou message manquant');
      return res.status(400).json({ message: 'Le sujet et le message sont requis' });
    }

    // Récupérer les infos complètes de l'utilisateur depuis la DB
    console.log(' Recherche utilisateur dans la DB...');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });

    if (!user) {
      console.log(' Utilisateur non trouvé avec ID:', userId);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    console.log(' Utilisateur trouvé:', user.name, '(', user.email, ')');
    
    // Toujours sauvegarder le message dans le fichier JSON
    console.log('💾 Sauvegarde du message dans contact-messages.json...');
    const saved = saveContactMessage(user.name, user.email, subject, message);
    console.log(' Message sauvegardé:', saved);
    
    // Essayer d'envoyer l'email (ne bloque pas si ça échoue)
    console.log(' Tentative d\'envoi d\'email...');
    try {
      await sendContactEmail(user.name, user.email, subject, message);
      console.log(' Email envoyé avec succès à', process.env.ADMIN_EMAIL);
    } catch (emailError) {
      console.log(' Email non envoyé, mais message sauvegardé');
      console.log('Erreur email:', emailError.message);
      console.log('Stack:', emailError.stack);
    }
    
    console.log('==============================================');
    
    // Toujours confirmer la réception
    res.status(200).json({ 
      message: 'Votre message a été reçu. Nous vous répondrons dans les plus brefs délais.' 
    });
  } catch (error) {
    console.error(' ERREUR CRITIQUE lors du traitement du message de contact');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.log('==============================================');
    res.status(500).json({ 
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.' 
    });
  }
};

// Récupérer tous les messages de contact (pour l'admin)
const getContactMessages = async (req, res) => {
  try {
    const messages = getAllContactMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des messages' });
  }
};

module.exports = {
  sendContact,
  getContactMessages,
};

