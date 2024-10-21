const express = require('express');
const { submitELDLoadTracking } = require('../controllers/eldLoadTrackingController');
const router = express.Router();

// Route to handle ELD Load Tracking form submission
router.post('/submit-eld-load-tracking', submitELDLoadTracking);

module.exports = router;
