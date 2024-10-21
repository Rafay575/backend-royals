
const express = require('express');
const { submitSupplierDiversity } = require('../controllers/supplierDiversityController');
const router = express.Router();

// Route to handle supplier diversity form submission
router.post('/submit-supplier-diversity', submitSupplierDiversity);

module.exports = router;
