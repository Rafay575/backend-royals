const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { generatePassword } = require('../services/passwordService');
const { sendEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET;

exports.sendOtp = (req, res) => {
  const { email, company, contact, address, phone } = req.body;

  if (!email || !company || !contact || !address || !phone ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query('SELECT email FROM carrier_users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Error fetching email:', err);
        connection.release();
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'Email already exists' });
      }

      const password = generatePassword();
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          connection.release();
          return res.status(500).json({ error: 'Error hashing password' });
        }

        connection.query(
          'INSERT INTO carrier_users (email, company, contact, address, phone, type, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [email, company, contact, address, phone, "", hashedPassword],
          (err) => {
            connection.release();
            if (err) {
              console.error('Error inserting user:', err);
              return res.status(500).json({ error: 'Database error' });
            }

            sendEmail(email, password)
              .then(() => {
                const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ message: 'User created and credentials sent successfully', token });
              })
              .catch(err => res.status(500).json({ error: 'Email sending failed' }));
          }
        );
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  pool.query('SELECT * FROM carrier_users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isPasswordValid) => {
      if (err) {
        console.error('Error comparing password:', err);
        return res.status(500).json({ error: 'Password comparison error' });
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token, id:user.id });
    });
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  pool.query('SELECT * FROM carrier_users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching user by ID:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(results[0]); // Return the user data
  });
};

exports.logout = (req, res) => {
 
  res.json({ message: 'Logout successful. Please remove the token from localStorage.' });
};
