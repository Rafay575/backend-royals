const express = require('express');
const router = express.Router();
const carrierController = require('../controllers/carrierController');

// Route to submit carrier data
router.post('/submit-carrier', carrierController.submitCarrierData);

module.exports = router;
