const express = require('express');
const { a } = require('../controllers/truckloadController');

const router = express.Router();

// Define the route for the contact form submission
router.get('/', a);

module.exports = router;