const db = require('../config/db');
// const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn');

// Function to handle the subscription logic
const addSubscriber = (req, res) => {
  const { email } = req.body;

  // Validate the email input
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'A valid email address is required' });
  }

  // SQL query to insert the email into the subscribers table
  const query = `INSERT INTO subscribers (email) VALUES (?)`;

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error saving data to the database:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Hypothetically update a column after successful insertion (if necessary)
    res.status(201).json({ message: 'Subscription successful!', data: result });
  });
};

module.exports = {
  addSubscriber
};
