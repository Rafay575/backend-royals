const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn ');

// Helper function to convert checkbox/radio values to 1 (true) or 0 (false)
const parseBoolean1 = (value) => {
    return value === 'true' || value === true ? 1 : 0;
};

// Route to handle form submission
router.post('/carrier-equipment', (req, res) => {
    const { reg_id, companyDrivers, teams, ownerOperators, hasMexicoInterchange, hasCanadianAuthority,
        dryLtl, dryVan, flatbed, refrigerated, refrigeratedLtl, specialEquipment,
        tractorPowerUnits, scacCode, commodities, smartWay, fast, carb, safetyPermit,
        cTpat, twic, hazmatCertification, dropTrailer,
        FootVans48, FootVans53, FootReefers48, FootReefers53, FootBeds48, FootBeds53
    } = req.body;
    console.log(req.body)

    if (!companyDrivers || !scacCode) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    const query = `INSERT INTO carrierEquipmentProfile
        (
            reg_id, companyDrivers, teams, ownerOperators, hasMexicoInterchange, hasCanadianAuthority, dryLtl, dryVan, 
            flatbed, refrigerated, refrigeratedLtl, specialEquipment, tractorPowerUnits, scacCode, commodities, 
            smartWay, fast, carb, safetyPermit, cTpat, twic, hazmatCertification, dropTrailer,
            FootVans48, FootVans53, FootReefers48, FootReefers53, FootBeds48, FootBeds53
        ) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.query(query, [
        reg_id,
        companyDrivers,
        teams,
        ownerOperators,
        parseBoolean1(hasMexicoInterchange),
        parseBoolean1(hasCanadianAuthority),
        parseBoolean1(dryLtl), // Assuming `dryLtl` is also boolean and needs parsing
        parseBoolean1(dryVan),
        parseBoolean1(flatbed),
        parseBoolean1(refrigerated),
        parseBoolean1(refrigeratedLtl),
        JSON.stringify(specialEquipment),
        tractorPowerUnits,
        scacCode,
        JSON.stringify(commodities),
        parseBoolean1(smartWay),
        parseBoolean1(fast),
        parseBoolean1(carb),
        parseBoolean1(safetyPermit),
        parseBoolean1(cTpat),
        parseBoolean1(twic),
        parseBoolean1(hazmatCertification),
        parseBoolean1(dropTrailer),
        FootVans48,
        FootVans53,
        FootReefers48,
        FootReefers53,
        FootBeds48,
        FootBeds53
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        updateRegistrationColumn("CarrierEquipmentProfile", reg_id)
        .then((result) => {
            console.log("Column updated successfully:", result);
        })
        .catch((error) => {
            console.error("Error updating column:", error);
        });
        res.json({ message: 'Form submitted successfully', id: this.lastID });
    });
});

module.exports = router;
