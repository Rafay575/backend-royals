require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const truckloadRoutes = require("./routes/truckloadRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Serve uploaded files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
=======
>>>>>>> parent of 37352a5 (commit address info api)
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", truckloadRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
