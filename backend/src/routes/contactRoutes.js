const express = require('express');
const router = express.Router();
const { sendContact, getContactMessages } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/contact - Envoyer un message de contact
router.post('/', protect, sendContact);

// GET /api/contact/messages - Récupérer tous les messages (admin)
router.get('/messages', protect, getContactMessages);

module.exports = router;
