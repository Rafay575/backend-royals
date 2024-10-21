// controllers/contactController.js
const pool = require('../config/db');
const { updateRegistrationColumn } = require('../helper/updateRegistrationColumn ');

const submitContactForm = (req, res) => {
  const {
    reg_id,
    corporateFullName,
    corporateTitle,
    corporatePhoneNumber,
    corporatePhoneExt,
    corporateEmail,
    corporateCellPhone,
    corporateFax,
    accountingFullName,
    accountingTitle,
    accountingPhoneNumber,
    accountingPhoneExt,
    accountingEmail,
    accountingCellPhone,
    accountingFax,
    dispatchFullName,
    dispatchTitle,
    dispatchPhoneNumber,
    dispatchPhoneExt,
    dispatchEmail,
    dispatchCellPhone,
    dispatchFax
  } = req.body;

  const sql = `
    INSERT INTO ContactInformation (
      reg_id, corporateFullName, corporateTitle, corporatePhoneNumber, corporatePhoneExt, corporateEmail, corporateCellPhone, corporateFax,
      accountingFullName, accountingTitle, accountingPhoneNumber, accountingPhoneExt, accountingEmail, accountingCellPhone, accountingFax,
      dispatchFullName, dispatchTitle, dispatchPhoneNumber, dispatchPhoneExt, dispatchEmail, dispatchCellPhone, dispatchFax
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(sql, [
    reg_id, corporateFullName, corporateTitle, corporatePhoneNumber, corporatePhoneExt, corporateEmail, corporateCellPhone, corporateFax,
    accountingFullName, accountingTitle, accountingPhoneNumber, accountingPhoneExt, accountingEmail, accountingCellPhone, accountingFax,
    dispatchFullName, dispatchTitle, dispatchPhoneNumber, dispatchPhoneExt, dispatchEmail, dispatchCellPhone, dispatchFax
  ], (err, result) => {
    if (err) {
      console.error('Error inserting contact data:', err);
      return res.status(500).send('Error saving contact form data');
    }
    updateRegistrationColumn("ContactInformation", reg_id)
    .then((result) => {
      console.log("Column updated successfully:", result);
    })
    .catch((error) => {
      console.error("Error updating column:", error);
    });
    res.status(200).send('Contact form data saved successfully');
  });
};

module.exports = {
  submitContactForm
};
