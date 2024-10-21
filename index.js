require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

const authRoutes = require("./routes/authRoutes");
const formRoutes  = require('./routes/addressRoutes');
const contactRoutes = require("./routes/contactRoutes");
const carrierRoutes  = require('./routes/carrierRoutes');
const truckloadRoutes = require("./routes/truckloadRoutes");
const contactInfoRoutes = require('./routes/contactInfoRoutes');
const carrierPoliciesRoutes = require('./routes/carrierPoliciesRoutes');
const companyAgreementRoutes = require('./routes/companyAgreementRoutes');
const insuranceRoutes = require('./routes/insuranceRoutes');
const supplierDiversityRoutes = require('./routes/supplierDiversityRoutes');
const eldLoadTrackingRoutes = require('./routes/eldLoadTrackingRoutes');
const carrierEquipmentRoutes = require('./controllers/carrierEquipmentController');
const carbComplianceRoutes = require('./routes/carbComplianceRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api', carrierRoutes);
app.use('/api', formRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", truckloadRoutes);
app.use('/api/contact-carrier', contactInfoRoutes);
app.use('/api/carrier-policies', carrierPoliciesRoutes);
app.use('/api/company-agreement', companyAgreementRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/supplier-diversity', supplierDiversityRoutes);
app.use('/api/eld-load-tracking', eldLoadTrackingRoutes);
app.use('/api', carrierEquipmentRoutes);
app.use('/api', carbComplianceRoutes);
app.use('/api', registrationRoutes);
app.use('/api', subscriberRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
