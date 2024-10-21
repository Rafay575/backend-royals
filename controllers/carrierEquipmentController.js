const express = require('express');
const router = express.Router();

const db = require('../config/db');

// Helper function to convert checkbox/radio values
const parseBoolean = (value) => value === 'yes';

// Route to handle form submission
router.post('/carrier-equipment', (req, res) => {
    const {reg_id,companyDrivers, teams, ownerOperators, hasMexicoInterchange, hasCanadianAuthority,
        dryLtl, dryVan, flatbed, refrigerated, refrigeratedLtl, specialEquipment,
        tractorPowerUnits, scacCode, commodities, smartWay, fast, carb, safetyPermit,
        cTpat, twic, hazmatCertification, dropTrailer,
        FootVans48,FootVans53,FootReefers48, FootReefers53, FootBeds48, FootBeds53
    } = req.body;
    console.log(req.body)

    if (!companyDrivers || !scacCode) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    const query = `INSERT INTO carrierEquipmentProfile
        (
    reg_id,companyDrivers, teams, ownerOperators, hasMexicoInterchange, hasCanadianAuthority, dryLtl, dryVan, 
        flatbed, refrigerated, refrigeratedLtl, specialEquipment, tractorPowerUnits, scacCode, commodities, 
        smartWay, fast, carb, safetyPermit, cTpat, twic, hazmatCertification, dropTrailer,
        FootVans48, FootVans53, FootReefers48, FootReefers53, FootBeds48, FootBeds53
        ) 
        VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [reg_id,
        companyDrivers, teams, ownerOperators, parseBoolean(hasMexicoInterchange), parseBoolean(hasCanadianAuthority),
        parseBoolean(dryLtl), parseBoolean(dryVan), parseBoolean(flatbed), parseBoolean(refrigerated), parseBoolean(refrigeratedLtl),
        JSON.stringify(specialEquipment), tractorPowerUnits, scacCode, JSON.stringify(commodities),
        parseBoolean(smartWay), parseBoolean(fast), parseBoolean(carb), parseBoolean(safetyPermit), parseBoolean(cTpat),
        parseBoolean(twic), parseBoolean(hazmatCertification), parseBoolean(dropTrailer),
        FootVans48, FootVans53, FootReefers48, FootReefers53,FootBeds48, FootBeds53
    ], (err,result)=> {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Form submitted successfully', id: this.lastID });
    });
});

module.exports = router;
