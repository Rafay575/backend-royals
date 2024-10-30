const express = require('express');
const router = express.Router();
const { submitForm } = require('../controllers/formController');

// POST route for form submission
router.post('/submit', submitForm);

module.exports = router;
