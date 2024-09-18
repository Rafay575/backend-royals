const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 30000, // Extend timeout to 30 seconds
  acquireTimeout: 30000, // Optional: set acquisition timeout if required
  waitForConnections: true,
  queueLimit: 0, // No limit to queue requests
  multipleStatements: true // Enable if you need to execute multiple statements
});

module.exports = pool;
