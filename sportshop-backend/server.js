const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/db');

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const productRoutes = require('./routes/products');

// Use routes
app.use("/api/products", productRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
