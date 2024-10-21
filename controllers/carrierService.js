const db = require('../config/db');

const insertCarrierData = (mcNumber, dotNumber, reg_id) => {
  console.log(reg_id)
  return new Promise((resolve, reject) => {
    const query1 = `INSERT INTO carriers (reg_id, mc_number, dot_number) VALUES (?, ?, ?)`;

    // First query to insert into carriers
    db.query(query1, [reg_id, mcNumber, dotNumber], (err, results) => {
      if (err) {
        return reject(err); // If error in first query, reject Promise
      }

      // If the first query is successful, proceed with the second query
      console.log(reg_id)
      const query2 = `INSERT INTO registration (user_id) VALUES (?)`;

      db.query(query2, [reg_id], (err, results2) => {
        if (err) {
          return reject(err); // If error in second query, reject Promise
        }
        resolve(results2); // Resolve if both queries succeed
      });
    });
  });
};

module.exports = {
  insertCarrierData
};
