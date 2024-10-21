const db = require('../config/db');
const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn ');
// Function to insert paymentType into the CarrierPolicies table
const submitCarrierPolicies = (req, res) => {
    const { paymentType, reg_id } = req.body; // Get paymentType from the request body
    // Assuming req.userId contains the logged-in user's reg_id
    console.log(reg_id)
    // Check if the paymentType is provided
    if (!paymentType) {
        return res.status(400).json({ message: 'Payment type is required' });
    }
    console.log(reg_id)
    if (!reg_id) {
        return res.status(400).json({ message: 'Payment type is required' });
    }


    // SQL query to insert paymentType for the specific reg_id
    const query = 'INSERT INTO CarrierPolicies (reg_id, paymentType) VALUES (?, ?)';

    db.query(query, [reg_id, paymentType], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        updateRegistrationColumn("CarrierPolicies", reg_id)
            .then((result) => {
                console.log("Column updated successfully:", result);
            })
            .catch((error) => {
                console.error("Error updating column:", error);
            });
        res.status(200).json({ message: 'Carrier policies submitted successfully', data: result });
    });
};

module.exports = {
    submitCarrierPolicies
};
