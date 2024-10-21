exports.a = (req, res) => {
    res.status(200).send('Message sent successfully!');

};
const pool = require('../config/db');

exports.submitTruckloadQuote = (req, res) => {
    const { firstName, lastName, phone, email, title, company, origin, destination, pickupDate, deliveryDate, commodity, weight, equipment, trailerSize, specialInstructions,truckType } = req.body;

    if (!firstName || !lastName || !phone || !email || !company || !origin || !destination || !pickupDate || !deliveryDate || !commodity || !weight || !equipment || !trailerSize || truckType) {
        return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const query = `
        INSERT INTO truckload_quotes 
        (firstName, lastName, phone, email, title, company, origin, destination, pickupDate, deliveryDate, commodity, weight, equipment,truckType, trailerSize, specialInstructions) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    pool.query(query, [firstName, lastName, phone, email, title, company, origin, destination, pickupDate, deliveryDate, commodity, weight, equipment,truckType, trailerSize, specialInstructions], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Error inserting data' });
        }
        res.status(200).json({ message: 'Form submitted successfully!' });
    });
};
