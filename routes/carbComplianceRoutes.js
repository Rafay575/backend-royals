const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitComplianceForm } = require('../controllers/carbComplianceController');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Save files with unique names
  }
});

const upload = multer({ storage: storage });

// POST route for submitting compliance form data
router.post('/compliance', upload.single('certificateFile'), submitComplianceForm);

module.exports = router;
