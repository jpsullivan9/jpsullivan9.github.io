const express = require("express");
const data = require('./data.js');
const app = express();

// Endpoint to get product data
app.get("/api/products", (req, res) => {
    res.send(data.products);
});

// Start the server
const PORT = process.env.PORT || 5000; // Use the port provided by the environment or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
