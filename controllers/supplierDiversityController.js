const db = require('../config/db');
const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn ');

// Function to submit Supplier Diversity Information
const submitSupplierDiversity = (req, res) => {
  const { supplierDiversity,reg_id } = req.body;

  if (!supplierDiversity) {
    return res.status(400).json({ message: 'Supplier Diversity selection is required' });
  }

  // SQL query to insert the data into SupplierDiversityInformation table
  const query = `INSERT INTO SupplierDiversityInformation (reg_id, supplierDiversity) VALUES (?, ?)`;

  db.query(query, [reg_id, supplierDiversity], (err, result) => {
    if (err) {
      console.error('Error saving data to the database:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    updateRegistrationColumn("SupplierDiversityInformation", reg_id)
    .then((result) => {
      console.log("Column updated successfully:", result);
    })
    .catch((error) => {
      console.error("Error updating column:", error);
    });
    res.status(200).json({ message: 'Supplier Diversity information submitted successfully', data: result });
  });
};

module.exports = {
  submitSupplierDiversity
};