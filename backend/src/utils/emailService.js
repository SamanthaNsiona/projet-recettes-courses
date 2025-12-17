const nodemailer = require('nodemailer');

// Créer un transporteur d'email
const createTransporter = () => {
  // Configuration pour Gmail
  // Tu devras créer un "App Password" dans ton compte Gmail
  // https://myaccount.google.com/apppasswords
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Ton adresse Gmail
      pass: process.env.EMAIL_PASSWORD, // Ton App Password Gmail
    },
  });
};

// Envoyer un email de réinitialisation de mot de passe
const sendPasswordResetEmail = async (email, resetToken) => {
  console.log(' sendPasswordResetEmail - Début');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD défini:', !!process.env.EMAIL_PASSWORD);
  
  const transporter = createTransporter();
  console.log('Transporter créé');
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  console.log('Reset URL:', resetUrl);
  
  const mailOptions = {
    from: `"MyRecipes" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - MyRecipes',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte MyRecipes.</p>
        <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #9ca3af; 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 4px;
                    display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Ce lien est valable pendant 1 heure.
        </p>
        <p style="color: #666; font-size: 14px;">
          Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          MyRecipes - Gestion de recettes et listes de courses
        </p>
      </div>
    `,
    text: `
      Réinitialisation de mot de passe
      
      Vous avez demandé la réinitialisation de votre mot de passe pour votre compte MyRecipes.
      
      Cliquez sur le lien suivant pour réinitialiser votre mot de passe :
      ${resetUrl}
      
      Ce lien est valable pendant 1 heure.
      
      Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
    `,
  };

  console.log('Options email configurées, envoi en cours...');
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(' Email envoyé avec succès! Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error(' Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

// Envoyer un email de contact vers l'admin
const sendContactEmail = async (userName, userEmail, subject, message) => {
  console.log(' sendContactEmail - Début');
  console.log('De:', userName, '(', userEmail, ')');
  console.log('Objet:', subject);
  console.log('Message:', message);
  
  // En mode développement ou si l'email n'est pas configuré correctement, on simule l'envoi
  // Le message reste sauvegardé dans contact-messages.json
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD.length < 15) {
    console.log(' Configuration email non valide - Message sauvegardé mais email non envoyé');
    console.log(' MESSAGE DE CONTACT (voir contact-messages.json):');
    console.log('===============================================');
    console.log(`De: ${userName} (${userEmail})`);
    console.log(`Objet: ${subject}`);
    console.log(`Message:\n${message}`);
    console.log('===============================================');
    console.log(' Pour activer l\'envoi d\'emails : configurez EMAIL_PASSWORD dans .env avec un mot de passe d\'application Gmail');
    return true;
  }
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"MyRecipes Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Email de l'admin
    replyTo: userEmail, // Permet de répondre directement à l'utilisateur
    subject: `Contact MyRecipes: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Nouveau message de contact</h2>
        <p><strong>De:</strong> ${userName} (${userEmail})</p>
        <p><strong>Objet:</strong> ${subject}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <div style="background-color: #f5f5f5; padding: 20px; border-left: 3px solid #171717;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          MyRecipes - Système de contact
        </p>
      </div>
    `,
    text: `
      Nouveau message de contact
      
      De: ${userName} (${userEmail})
      Objet: ${subject}
      
      Message:
      ${message}
    `,
  };

  console.log('Envoi email de contact vers:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(' Email de contact envoyé avec succès! Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error(' Erreur lors de l\'envoi de l\'email de contact:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendContactEmail,
};

