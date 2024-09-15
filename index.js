require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require("cors");

const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT || 5000;

var Parse = require('parse/node');
Parse.initialize("h8dr3hSFNK34QbYkfcfUumbJxE7xy0oacBYoAmyC","bBSMMYizf34cjj6fZoDBFn7SPgzuuzshdr7oVoR1"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = 'https://parseapi.back4app.com/'

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a random password
const generatePassword = () => Math.random().toString(36).slice(-8);

// API to send OTP and save user info
app.post('/send-otp', (req, res) => {
  const { email, company, contact, address, phone, type } = req.body;

  if (!email || !company || !contact || !address || !phone || !type) {
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
          [email, company, contact, address, phone, type, hashedPassword],
          (err) => {
            connection.release();
            if (err) {
              console.error('Error inserting user:', err);
              return res.status(500).json({ error: 'Database error' });
            }

            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'Your Login Credentials',
              text: `Welcome! Here are your login credentials: \n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.`,
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ error: 'Email sending failed' });
              }
              console.log(`Credentials sent to ${email}`);
              res.json({ message: 'User created and credentials sent successfully', token });
            });
          }
        );
      });
    });
  });
});

// API to create truckload quotes table
app.get('/api/create-table', (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS truckload_quotes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255),
      lastName VARCHAR(255),
      phone VARCHAR(20),
      email VARCHAR(255),
      title VARCHAR(255),
      company VARCHAR(255),
      origin VARCHAR(255),
      destination VARCHAR(255),
      pickupDate DATE,
      deliveryDate DATE,
      commodity VARCHAR(255),
      weight INT,
      equipment VARCHAR(255),
      trailerSize VARCHAR(255),
      specialInstructions TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  pool.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
      return res.status(500).send('Error creating table');
    }
    res.send('Truckload Quotes table created successfully');
  });
});

// POST endpoint to insert contact data
app.post('/api/contact', (req, res) => {
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
});

// API to submit truckload quotes
app.post('/api/submit-truckload-quote', (req, res) => {
  const { firstName, lastName, phone, email, title, company, origin, destination, pickupDate, deliveryDate, commodity, weight, equipment, trailerSize, specialInstructions } = req.body;

  const insertQuery = `
    INSERT INTO truckload_quotes 
    (firstName, lastName, phone, email, title, company, origin, destination, pickupDate, deliveryDate, commodity, weight, equipment, trailerSize, specialInstructions) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(insertQuery, [firstName, lastName, phone, email, title, company, origin, destination, pickupDate, deliveryDate, commodity, weight, equipment, trailerSize, specialInstructions], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error inserting data');
    }
    res.status(200).send('Form submitted successfully!');
  });
});

// Login endpoint
app.post('/login', (req, res) => {
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

      res.json({ message: 'Login successful', token });
    });
  });
});
app.use("/a",(req,res)=>{
  res.status(201).send({message:"Hello"})
})
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
