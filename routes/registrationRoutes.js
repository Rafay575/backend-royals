const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// Define route to fetch registration by user_id
router.get('/registration/:user_id', registrationController.getRegistrationByUserId);

module.exports = router;
