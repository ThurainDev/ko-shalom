const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');

// Public contact form submission
router.post('/', ContactController.create);

module.exports = router; 