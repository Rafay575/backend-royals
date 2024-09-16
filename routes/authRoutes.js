const express = require('express');
const { sendOtp, login } = require('../controllers/authController');
const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/login', login);

module.exports = router;
