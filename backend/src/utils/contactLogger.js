const fs = require('fs');
const path = require('path');

// Fichier pour stocker les messages de contact
const CONTACT_LOG_FILE = path.join(__dirname, '../../contact-messages.json');

// Sauvegarder un message de contact
const saveContactMessage = (userName, userEmail, subject, message) => {
  const contactMessage = {
    id: Date.now(),
    date: new Date().toISOString(),
    from: {
      name: userName,
      email: userEmail
    },
    subject: subject,
    message: message,
    status: 'unread'
  };

  let messages = [];
  
  // Lire les messages existants
  if (fs.existsSync(CONTACT_LOG_FILE)) {
    try {
      const data = fs.readFileSync(CONTACT_LOG_FILE, 'utf8');
      messages = JSON.parse(data);
    } catch (error) {
      console.error('Erreur lecture fichier contact:', error);
    }
  }

  // Ajouter le nouveau message
  messages.unshift(contactMessage); // Ajoute au début

  // Garder seulement les 100 derniers messages
  if (messages.length > 100) {
    messages = messages.slice(0, 100);
  }

  // Sauvegarder
  try {
    fs.writeFileSync(CONTACT_LOG_FILE, JSON.stringify(messages, null, 2));
    console.log('✅ Message de contact sauvegardé dans', CONTACT_LOG_FILE);
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde message:', error);
    return false;
  }
};

// Récupérer tous les messages
const getAllContactMessages = () => {
  if (!fs.existsSync(CONTACT_LOG_FILE)) {
    return [];
  }

  try {
    const data = fs.readFileSync(CONTACT_LOG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lecture messages:', error);
    return [];
  }
};

module.exports = {
  saveContactMessage,
  getAllContactMessages
};
