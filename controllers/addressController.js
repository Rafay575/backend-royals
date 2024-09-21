const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Create a unique filename
  },
});

const upload = multer({ storage });

// Controller to handle form submission
const submitAddressForm = (req, res) => {
  const {
    companyName, dba, address, suite, city, state, zip, country,
    factoringCompany, payToCompanyName, payToAddress, payToAddress2, payToCity,
    payToState, payToZip, payToCountry, payToEmail, dunsNumber, w9Name, federalId,
  } = req.body;

  const w9FilePath = req.file ? req.file.path : '';

  const sql = `
    INSERT INTO address_information (
      companyName, dba, address, suite, city, state, zip, country,
      factoringCompany, payToCompanyName, payToAddress, payToAddress2, payToCity,
      payToState, payToZip, payToCountry, payToEmail, dunsNumber, w9Name, federalId, w9FilePath
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    companyName, dba, address, suite, city, state, zip, country, factoringCompany,
    payToCompanyName, payToAddress, payToAddress2, payToCity, payToState, payToZip, payToCountry,
    payToEmail, dunsNumber, w9Name, federalId, w9FilePath,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving data to the database:', err);
      return res.status(500).json({ error: 'Failed to save form data' });
    }

    res.status(200).json({ message: 'Form submitted successfully', data: result });
  });
};

module.exports = {
  submitAddressForm,
  upload,
};
