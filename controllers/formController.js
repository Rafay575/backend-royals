const pool = require("../config/db");

// Controller function for form submission
const submitForm = (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  // Validate the incoming data
  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if the email already exists in the database
  const checkEmailSql = 'SELECT * FROM form_submissions WHERE email = ?';
  
  pool.query(checkEmailSql, [email], (error, results) => {
    if (error) {
      console.error('Error checking email:', error);
      return res.status(500).json({ message: 'Failed to submit the form.' });
    }

    if (results.length > 0) {
      // If the email is found, return a message saying the form is already submitted
      return res.status(200).json({ message: 'Form submitted successfully!'});
    }

    // If email is not found, insert the new form data
    const insertSql = 'INSERT INTO form_submissions (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)';
    
    pool.query(insertSql, [firstName, lastName, email, phone], (error, results) => {
      if (error) {
        console.error('Error inserting form data:', error);
        return res.status(500).json({ message: 'Failed to submit the form.' });
      }

      console.log('Form Data Inserted:', { firstName, lastName, email, phone });
      return res.status(200).json({
        message: 'Form submitted successfully!',
        data: { firstName, lastName, email, phone },
      });
    });
  });
};

module.exports = { submitForm };
