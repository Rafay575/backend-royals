const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactInfoController');

// POST route to submit contact information
router.post('/submit', submitContactForm);

module.exports = router;
