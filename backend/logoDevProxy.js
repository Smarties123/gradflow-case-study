import express from 'express';
import fetch from 'node-fetch';

import dotenv from 'dotenv';
dotenv.config(); // This loads .env variables globally for the entire application
// console.log("LOGO_DEV_API_KEY loaded from .env:", process.env.LOGO_DEV_API_KEY);

const router = express.Router();
const LOGO_DEV_API_KEY = process.env.LOGO_DEV_API_KEY; // Access the API key from the environment variables
// console.log("Using API Key:", LOGO_DEV_API_KEY);
router.get('/company-search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        // console.log("Sending request to Logo.dev API with query:", query);
        // console.log("Using API Key:", LOGO_DEV_API_KEY); // Ensure the API key is correct

        const response = await fetch(`https://api.logo.dev/search?q=${query}`, {
            headers: {
                'Bearer': `${LOGO_DEV_API_KEY}`, // Correct format
            },
        });

        // console.log("Response from Logo.dev API:", response.status); // Check the response status

        if (response.ok) {
            const data = await response.json();
            // console.log("Data received from Logo.dev API:", data);
            res.json(data); // Send the data back to the frontend
        } else {
            // console.error("Failed to fetch from Logo.dev API, status:", response.status);
            const errorData = await response.text(); // Fetch error text
            res.status(response.status).json({ message: errorData });
        }
    } catch (error) {
        // console.error('Error fetching company suggestions:', error); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
