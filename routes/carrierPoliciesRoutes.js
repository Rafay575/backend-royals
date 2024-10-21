const express = require('express');
const { submitCarrierPolicies } = require('../controllers/carrierPoliciesController');
const router = express.Router();

// Route to handle form submission
router.post('/submit-policies', submitCarrierPolicies);

module.exports = router;
