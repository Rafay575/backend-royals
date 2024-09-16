const pool = require('../config/db');

exports.submitContactForm = (req, res) => {
  const { user_name, user_email, phone_number, subject, message } = req.body;

  if (!user_name || !user_email || !phone_number || !subject || !message) {
    return res.status(400).send('All fields are required');
  }

  const query = `INSERT INTO contacts (user_name, user_email, phone_number, subject, message) VALUES (?, ?, ?, ?, ?)`;

  pool.query(query, [user_name, user_email, phone_number, subject, message], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Database Error');
    }
    res.status(200).send('Message sent successfully!');
  });
};
