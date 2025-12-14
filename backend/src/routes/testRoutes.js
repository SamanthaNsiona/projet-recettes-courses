const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Test endpoint pour hCaptcha
router.post('/test-hcaptcha', async (req, res) => {
  const { captchaToken } = req.body;

  console.log('\n════════════════════════════════════════');
  console.log('🔐 TEST HCAPTCHA - ENDPOINT');
  console.log('════════════════════════════════════════');
  console.log('🔑 Secret Key:', process.env.HCAPTCHA_SECRET_KEY);
  console.log('🎫 Token reçu:', captchaToken ? captchaToken.substring(0, 50) + '...' : 'AUCUN');
  console.log('════════════════════════════════════════\n');

  if (!captchaToken) {
    console.log('❌ Pas de token reçu\n');
    return res.status(400).json({ error: 'Pas de token' });
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', process.env.HCAPTCHA_SECRET_KEY);
    params.append('response', captchaToken);

    console.log('📡 Envoi à hCaptcha...');
    const response = await axios.post('https://hcaptcha.com/siteverify', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    console.log('✅ RÉPONSE HCAPTCHA:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('════════════════════════════════════════\n');

    res.json(response.data);
  } catch (error) {
    console.log('❌ ERREUR:');
    console.log(error.message);
    console.log('════════════════════════════════════════\n');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
