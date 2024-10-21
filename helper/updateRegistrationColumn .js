
const db = require("../config/db");
const updateRegistrationColumn = (columnName, reg_id) => {
    return new Promise((resolve, reject) => {
      // Construct dynamic SQL query with the column name
      const query = `UPDATE registration SET ?? = '1' WHERE user_id = ?`;
  
      // Execute the query, passing the column name and reg_id as parameters
      db.query(query, [columnName, reg_id], (err, results) => {
        if (err) {
          return reject(err); // Reject promise if error
        }
        resolve(results); // Resolve promise if successful
      });
    });
  };
  
  module.exports = {
    updateRegistrationColumn
  };
  