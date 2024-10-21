// /controllers/subscriberController.js
const db = require('../config/db'); // Adjust the path based on your project structure

// Function to handle the subscription logic
const addSubscriber = async (req, res) => {
    const { email } = req.body;

    // Validate the email input
    console.log(email)
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'A valid email address is required' });
    }

    try {
        // Insert the email into the subscribers table
        const query = `INSERT INTO subscribers (email) VALUES (?)`;
        await db.run(query, [email]);

        // Send success response
        res.status(201).json({ message: 'Subscription successful!' });
    } catch (error) {
        console.error('Error subscribing user:', error);
        res.status(500).json({ error: 'An error occurred while subscribing.' });
    }
};

module.exports = {
    addSubscriber
};
