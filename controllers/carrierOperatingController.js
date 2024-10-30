const db = require('../config/db'); // Assuming your MySQL connection is set up here
const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn ');

// Helper function to insert carrier operating area data
exports.createCarrierOperatingArea = (req, res) => {
    const {
        reg_id,
        selectedZones,
        selectedStates,
        selectedDestZones,
        selectedDestStates,
        availableCity,
        availableState,
        preferredDestination,
        destinationState,
        equipment
    } = req.body;
    console.log(req.body)
    // Input validation
    if (!selectedZones.length || !selectedDestZones.length) {
        return res.status(400).json({ error: "Please select at least one zone for origin and destination." });
    }

    const query = `
        INSERT INTO carrierOperatingAreas (
        reg_id,
            selectedZones, selectedStates, selectedDestZones, selectedDestStates, 
            availableCity, availableState, preferredDestination, destinationState, equipment
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        reg_id,
        JSON.stringify(selectedZones),  // Store as JSON
        JSON.stringify(selectedStates), // Store as JSON
        JSON.stringify(selectedDestZones), // Store as JSON
        JSON.stringify(selectedDestStates), // Store as JSON
        availableCity,
        availableState,
        preferredDestination,
        destinationState,
        equipment
    ], (err, result) => {
        if (err) {
            console.log("false")
            return res.status(500).json({ error: err.message });
        }
        updateRegistrationColumn("CarrierOperatingAreas", reg_id)
    .then((result) => {
        console.log("Column updated successfully:", result);
    })
    .catch((error) => {
        console.error("Error updating column:", error);
    });
        console.log("True")
        res.json({ message: "Carrier operating area saved successfully!", id: result.insertId });
    });
};
