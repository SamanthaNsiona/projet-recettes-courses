// Middleware pour vérifier hCaptcha
async function verifyHCaptchaMiddleware(req, res, next) {
  const token = req.body.captchaToken;
  
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('🔐 VÉRIFICATION HCAPTCHA MIDDLEWARE');
  console.log('════════════════════════════════════════════════════════════');
  console.log('Token reçu:', token ? '✅ OUI' : '❌ NON');

  if (!token) {
    console.log('❌ Captcha manquant');
    console.log('════════════════════════════════════════════════════════════\n');
    return res.status(400).json({ error: "Captcha manquant" });
  }

  try {
    console.log('📡 Envoi à hCaptcha...');
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${token}`
    });

    const data = await response.json();
    console.log('📡 Réponse hCaptcha:', JSON.stringify(data, null, 2));

    if (!data.success) {
      console.log('❌ Captcha invalide - Erreurs:', data['error-codes']);
      
      // Vérifier les erreurs spécifiques
      if (data['error-codes']?.includes('sitekey-secret-mismatch')) {
        console.error('🚨 ERREUR CRITIQUE: Les clés site et secret ne correspondent pas!');
        console.error('   Site Key (Frontend): 10000000-ffff-ffff-ffff-000000000001');
        console.error('   Secret Key (Backend):', process.env.HCAPTCHA_SECRET_KEY);
        console.error('   → Vérifiez https://dashboard.hcaptcha.com/');
      }
      
      if (data['error-codes']?.includes('invalid-request')) {
        console.error('🚨 ERREUR: Requête invalide à hCaptcha');
      }
      
      if (data['error-codes']?.includes('invalid-response')) {
        console.error('🚨 ERREUR: Token invalide ou expiré');
      }
      
      console.log('════════════════════════════════════════════════════════════\n');
      return res.status(400).json({ 
        error: "Captcha invalide",
        details: data['error-codes'] 
      });
    }

    console.log('✅ Captcha valide - Passage à next()');
    console.log('════════════════════════════════════════════════════════════\n');
    next();
  } catch (err) {
    console.error('❌ Erreur hCaptcha:', err.message);
    console.log('════════════════════════════════════════════════════════════\n');
    return res.status(500).json({ error: "Erreur lors de la vérification captcha" });
  }
}

module.exports = { verifyHCaptchaMiddleware };
