// /routes/subscriberRoutes.js
const express = require('express');
const { addSubscriber } = require('../controllers/subscriberController');

const router = express.Router();

// Define the route for subscribing
router.post('/subscribe', addSubscriber);

module.exports = router;
