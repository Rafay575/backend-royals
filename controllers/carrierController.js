const carrierService = require('./carrierService');

const submitCarrierData = async (req, res) => {
  try {
    const { mcNumber, dotNumber, allowedToOperate ,reg_id} = req.body;

    // Validate if required fields are present
    console.log(reg_id)
    if (!mcNumber || !dotNumber) {
      return res.status(400).json({ message: 'MC Number and DOT Number are required' });
    }

    // Only proceed if allowedToOperate is 'Y'
    if (allowedToOperate !== 'Y') {
      return res.status(400).json({ message: 'Carrier is not allowed to operate.' });
    }

    const result = await carrierService.insertCarrierData(mcNumber, dotNumber,reg_id);

    res.status(200).json({ message: 'Carrier data submitted successfully', data: result });
  } catch (error) {
    console.error('Error in submitCarrierData:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitCarrierData
};
