const express = require('express');
const { submitTruckloadQuote,a } = require('../controllers/truckloadController');
const router = express.Router();

// Define the route for submitting the truckload quote form
router.post('/submit-truckload-quote', submitTruckloadQuote);
router.get('/test', a);

module.exports = router;
