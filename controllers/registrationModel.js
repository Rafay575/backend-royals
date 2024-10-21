const mysql = require('mysql2');

// Set up the database connection
const db = require('../config/db')
const fetchRegistrationByUserId = (user_id, callback) => {
  const query = `
    SELECT * FROM registration WHERE user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  fetchRegistrationByUserId
};
