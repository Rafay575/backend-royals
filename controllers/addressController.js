const pool = require("../config/db");
const { updateRegistrationColumn } = require("../helper/updateRegistrationColumn ");

const submitForm = (req, res) => {
  const {
    reg_id,
    companyName,
    dba,
    address,
    suite,
    city,
    state,
    zip,
    country,
    factoringCompany,
    sameAddress,
    payToCompanyName,
    payToAddress,
    payToAddress2,
    payToCity,
    payToState,
    payToZip,
    payToCountry,
    payToEmail,
    dunsNumber,
    w9Name,
    federalId,
  } = req.body;

  const a = req.file ? req.file.filename : null; // If file uploaded
  console.log("rafay 123456789 = ", a);
  const sql = `
    INSERT INTO AddressInformation (
      reg_id, companyName, dba, address, suite, city, state, zip, country,
      factoringCompany, sameAddress, payToCompanyName, payToAddress, payToAddress2,
      payToCity, payToState, payToZip, payToCountry, payToEmail, dunsNumber, w9Name,
      federalId, w9File
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  pool.query(
    sql,
    [
      reg_id,
      companyName,
      dba,
      address,
      suite,
      city,
      state,
      zip,
      country,
      factoringCompany,
      sameAddress,
      payToCompanyName,
      payToAddress,
      payToAddress2,
      payToCity,
      payToState,
      payToZip,
      payToCountry,
      payToEmail,
      dunsNumber,
      w9Name,
      federalId,
      a,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send("Error saving form data");
      }
      updateRegistrationColumn("AddressInformation", reg_id)
        .then((result) => {
          console.log("Column updated successfully:", result);
        })
        .catch((error) => {
          console.error("Error updating column:", error);
        });
      res.status(200).send("Form data saved successfully");
    }
  );
};

module.exports = {
  submitForm,
};
