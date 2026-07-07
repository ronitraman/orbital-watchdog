const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Define the path to where the Python engine saved the data
const dataPath = path.join(__dirname, '../backend-python/geo_state.json');

app.get('/api/geodata', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading geo_state.json:", err);
            return res.status(500).json({ error: "Failed to read geospatial telemetry." });
        }
        res.json(JSON.parse(data));
    });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Orbital Watchdog API running securely on http://localhost:${PORT}`);
    console.log(`Endpoint ready at http://localhost:${PORT}/api/geodata`);
});