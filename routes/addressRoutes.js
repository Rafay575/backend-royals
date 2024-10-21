const express = require('express');
const router = express.Router();
const { submitForm } = require('../controllers/addressController');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define where to store the file (make sure this folder exists)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });

// Route to handle form submission
router.post('/submit-form', upload.single('w9File'), submitForm);

module.exports = router;
