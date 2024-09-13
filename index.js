const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');  // Using mysql module
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MySQL Database connection setup
const db = mysql.createConnection({
  host: 'royalstarlogistics.online',  // Replace with the correct host if needed
  user: 'u273975820_royals',          // Your MySQL username
  password: 'R#||S[Ep7',           // Your MySQL password
  database: 'u273975820_royal'  
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL Database.');
});

// Nodemailer configuration for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'rafaymalik5763@gmail.com', // Your email
    pass: 'cbld isuv hqac ogcl',  // Your email password (use app password for security)
  },
});

// Generate a random password
const generatePassword = () => {
  return Math.random().toString(36).slice(-8); // Generates an 8-character password
};

// POST endpoint to handle form data and send credentials
app.post('/send-otp', (req, res) => {
  const { email, company, contact, address, phone, type } = req.body;

  // Check if required fields are provided
  if (!email || !company || !contact || !address || !phone || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    db.query('SELECT email FROM carrier_users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Error fetching email:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const password = generatePassword();
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ error: 'Error hashing password' });
        }

        // Insert user data into the database
        db.query(
          'INSERT INTO carrier_users (email, company, contact, address, phone, type, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [email, company, contact, address, phone, type, hashedPassword],
          (err) => {
            if (err) {
              console.error('Error inserting user:', err);
              return res.status(500).json({ error: 'Database error' });
            }

            // Generate a JWT token
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

            // Email configuration
            const mailOptions = {
              from: 'rafaymalik5763@gmail.com',
              to: email,
              subject: 'Your Login Credentials',
              text: `Welcome! Here are your login credentials: \n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.`,
            };

            // Send the email with credentials
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
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to create contacts table
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
  db.query(createTableQuery, (err, result) => {
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

  db.query(query, [user_name, user_email, phone_number, subject, message], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Database Error');
    }
    res.status(200).send('Message sent successfully!');
  });
});

// API to insert form data
app.post('/api/submit-truckload-quote', (req, res) => {
  const { firstName, lastName, phone, email, title, company, origin, destination, pickupDate, deliveryDate, commodity, weight, equipment, trailerSize, specialInstructions } = req.body;

  const insertQuery = `
    INSERT INTO truckload_quotes 
    (firstName, lastName, phone, email, title, company, origin, destination, pickupDate, deliveryDate, commodity, weight, equipment, trailerSize, specialInstructions) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [firstName, lastName, phone, email, title, company, origin, destination, pickupDate, deliveryDate, commodity, weight, equipment, trailerSize, specialInstructions], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error inserting data');
    }
    res.status(200).send('Form submitted successfully!');
  });
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    db.query('SELECT * FROM carrier_users WHERE email = ?', [email], (err, results) => {
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User data endpoint
const user = {
  id: 1,
  name: 'John Doe',
  email: 'johndoe@example.com'
};

// Endpoint to fetch user data
app.get('/api/user', (req, res) => {
  res.json(user);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
