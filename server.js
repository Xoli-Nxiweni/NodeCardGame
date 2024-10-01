import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import env from 'dotenv'
env.config()

const app = express();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Sample fruit data
const fruits = [
    { "emoji": "🍎", "matched": false },
    { "emoji": "🥑", "matched": false },
    { "emoji": "🍌", "matched": false },
    { "emoji": "🍒", "matched": false },
    { "emoji": "🍇", "matched": false },
    { "emoji": "🍍", "matched": false },
    { "emoji": "🍉", "matched": false },
    { "emoji": "🥝", "matched": false },
    { "emoji": "🍓", "matched": false },
    { "emoji": "🫐", "matched": false },
    { "emoji": "🍊", "matched": false },
    { "emoji": "🍋", "matched": false },
    { "emoji": "🥭", "matched": false },
    { "emoji": "🍐", "matched": false },
    { "emoji": "🍑", "matched": false },
    { "emoji": "🍈", "matched": false },
    { "emoji": "🥥", "matched": false },
    { "emoji": "🍏", "matched": false }
];

// API route to return the fruits data
app.get('/api/fruits', (req, res) => {
    res.json(fruits); // Send fruits data as JSON to the client
});

// Set the port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
