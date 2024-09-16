const express = require('express');
const { sendOtp, login } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/login', login);
router.get('/verify-token', verifyToken, (req, res) => {
    // If the token is valid, the middleware will call this
    res.status(200).json({ message: 'Token is valid', user: req.user });
  });
  


module.exports = router;
