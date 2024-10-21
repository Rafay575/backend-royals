const RegistrationModel = require('./registrationModel');

// Fetch data by user_id
const getRegistrationByUserId = (req, res) => {
  const userId = req.params.user_id;

  RegistrationModel.fetchRegistrationByUserId(userId, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching registration data' });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: 'No data found for the given user_id' });
    }
    res.status(200).json(data);
  });
};

module.exports = {
  getRegistrationByUserId
};
