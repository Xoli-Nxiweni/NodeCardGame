import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import env from 'dotenv';

env.config();

const app = express();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Sample shape data
const shapes = [
    { "icon": "fas fa-circle", "matched": false },
    { "icon": "fas fa-square", "matched": false },
    { "icon": "fas fa-star", "matched": false },
    { "icon": "fas fa-heart", "matched": false },
    { "icon": "fas fa-gem", "matched": false }, // changed from fa-diamond
    { "icon": "fas fa-exclamation-triangle", "matched": false }, // changed from fa-triangle
    { "icon": "fas fa-circle-notch", "matched": false },
    { "icon": "fas fa-arrow-circle-up", "matched": false },
    { "icon": "fas fa-bell", "matched": false },
    { "icon": "fas fa-moon", "matched": false },
    { "icon": "fas fa-sun", "matched": false },
    { "icon": "fas fa-cloud", "matched": false },
    { "icon": "fas fa-bolt", "matched": false },
    { "icon": "fas fa-snowflake", "matched": false },
    { "icon": "fas fa-leaf", "matched": false },
    { "icon": "fas fa-mountain", "matched": false },
    { "icon": "fas fa-umbrella", "matched": false },
    { "icon": "fas fa-water", "matched": false }
];



// API route to return the shape data
app.get('/api/shapes', (req, res) => {
    res.json(shapes); // Send shapes data as JSON to the client
});

// Set the port with a fallback to 3000 if the environment variable is not set
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
