require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const truckloadRoutes = require("./routes/truckloadRoutes");
const addressRoutes = require('./routes/addressRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares using
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", truckloadRoutes);
app.use('/api/address', addressRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
