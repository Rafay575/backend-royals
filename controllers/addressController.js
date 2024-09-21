const db = require('../config/db');
const multer = require('multer');

// Multer setup for file uploads (store files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Controller to handle form submission
const submitAddressForm = (req, res) => {
  const {
    companyName, dba, address, suite, city, state, zip, country,
    factoringCompany, payToCompanyName, payToAddress, payToAddress2, payToCity,
    payToState, payToZip, payToCountry, payToEmail, dunsNumber, w9Name, federalId,
  } = req.body;

  // Get the file from multer (stored in memory as Buffer)
  const w9File = req.file ? req.file.buffer : null;

  const sql = `
    INSERT INTO address_information (
      companyName, dba, address, suite, city, state, zip, country,
      factoringCompany, payToCompanyName, payToAddress, payToAddress2, payToCity,
      payToState, payToZip, payToCountry, payToEmail, dunsNumber, w9Name, federalId, w9File
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    companyName, dba, address, suite, city, state, zip, country, factoringCompany,
    payToCompanyName, payToAddress, payToAddress2, payToCity, payToState, payToZip, payToCountry,
    payToEmail, dunsNumber, w9Name, federalId, w9File,
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
