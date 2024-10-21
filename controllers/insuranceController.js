const path = require('path');
const db = require('../config/db');
const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn ');

// Function to store insurance file and details in the database
const uploadInsurance = (req, res) => {
  const { reg_id } = req.body; // Assuming `reg_id` is coming from the request body
  const file = req.file; // File object from multer

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // SQL query to save the file path and other information
  const query = `INSERT INTO InsuranceInstructions (reg_id, insuranceFile) VALUES (?, ?)`;
  const filePath = path.join('/uploads/insuranceuploads', file.filename);

  db.query(query, [reg_id, filePath], (err, result) => {
    if (err) {
      console.error('Error saving data to the database:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    updateRegistrationColumn("InsuranceInstructions", reg_id)
    .then((result) => {
      console.log("Column updated successfully:", result);
    })
    .catch((error) => {
      console.error("Error updating column:", error);
    });
    res.status(200).json({
      message: 'Insurance file uploaded and saved successfully',
      data: result,
      filePath: filePath
    });
  });
};

module.exports = {
  uploadInsurance
};
