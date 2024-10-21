const db = require('../config/db');
const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn ');

// Function to insert ELDLoadTracking data into the database
const submitELDLoadTracking = (req, res) => {
  const { reg_id, consent, eldCompliant, alcApp, trackingMethod, otherTrackingMethod } = req.body;

  if (!consent) {
    return res.status(400).json({ message: 'Consent is required' });
  }

  // SQL query to insert data into ELDLoadTracking table
  const query = `
    INSERT INTO ELDLoadTracking 
    (reg_id, consent, eldCompliant, alcApp, trackingMethod, otherTrackingMethod) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [reg_id, consent, eldCompliant, alcApp, trackingMethod, otherTrackingMethod || null],
    (err, result) => {
      if (err) {
        console.error('Error saving data to the database:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      updateRegistrationColumn("ELDLoadTracking", reg_id)
      .then((result) => {
        console.log("Column updated successfully:", result);
      })
      .catch((error) => {
        console.error("Error updating column:", error);
      });
      res.status(200).json({ message: 'ELD Load Tracking data submitted successfully', data: result });
    }
  );
};

module.exports = {
  submitELDLoadTracking
};
