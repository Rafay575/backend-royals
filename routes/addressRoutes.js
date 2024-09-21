const express = require('express');
const router = express.Router();
const { submitAddressForm, upload } = require('../controllers/addressController');

// Route to handle form submission
router.post('/submit', upload.single('w9File'), submitAddressForm);

module.exports = router;
