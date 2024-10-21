const express = require('express');
const { submitAgreement } = require('../controllers/companyAgreementController');
const router = express.Router();

// Route to handle agreement submission
router.post('/submit-agreement', submitAgreement);

module.exports = router;
