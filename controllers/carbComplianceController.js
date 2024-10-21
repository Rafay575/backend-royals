const db = require('../config/db');
const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn ');

exports.submitComplianceForm = (req, res) => {
    const {
        reg_id, carbCompliant, certificateIssuedTo, vehiclesReported,
        certificateValidUntil, trucrsId, complianceType, planningToComply
    } = req.body;

    console.log(req.body)
    const certificateFile = req.file ? req.file.filename : null;
    // SQL query to insert the form data into the database
    const query = `INSERT INTO carb_compliance 
    (reg_id,carbCompliant, planningToComply, certificateIssuedTo, vehiclesReported, certificateValidUntil, trucrsId, complianceType, certificateFile) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;

    const values = [reg_id, carbCompliant, planningToComply, certificateIssuedTo, vehiclesReported,
        certificateValidUntil, trucrsId, complianceType, certificateFile
    ];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Database insertion failed.' });
        } else {
            updateRegistrationColumn("CARBTruckBusCompliance", reg_id)
                .then((result) => {
                    console.log("Column updated successfully:", result);
                })
                .catch((error) => {
                    console.error("Error updating column:", error);
                });
            res.status(200).json({ message: 'Form data submitted successfully. ' });
        }
    });
};
