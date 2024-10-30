const express = require('express');
const router = express.Router();
const carrierController = require('../controllers/carrierOperatingController');

// POST route to handle form submission
router.post('/carrier-operating-areas', carrierController.createCarrierOperatingArea);

module.exports = router;
