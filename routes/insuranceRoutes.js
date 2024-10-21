const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadInsurance } = require('../controllers/insuranceController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/insuranceuploads')); // Save files in the insuranceuploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to handle insurance file upload
router.post('/upload-insurance', upload.single('insuranceFile'), uploadInsurance);

module.exports = router;
