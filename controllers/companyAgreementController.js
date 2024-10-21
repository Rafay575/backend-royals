const db = require('../config/db');
const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn ');

// Function to update isAgreed to true in the CompanyAgreement table
const submitAgreement = (req, res) => {
  const {reg_id} = req.body; // Assuming req.userId contains the logged-in user's reg_id

  // SQL query to update isAgreed for the specific reg_id
  const query = 'INSERT INTO CompanyAgreement (reg_id,isAgreed) VALUES(?,?) ';
  
  db.query(query, [reg_id,1], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    updateRegistrationColumn("CompanyAgreement", reg_id)
    .then((result) => {
        console.log("Column updated successfully:", result);
    })
    .catch((error) => {
        console.error("Error updating column:", error);
    });
    res.status(200).json({ message: 'Agreement submitted successfully', data: result });
  });
};

module.exports = {
  submitAgreement
};
