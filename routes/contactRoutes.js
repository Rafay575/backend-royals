const express = require('express');
const { submitContactForm } = require('../controllers/contactController');
const router = express.Router();

// Define the route for the contact form submission
router.post('/', submitContactForm);

module.exports = router;
