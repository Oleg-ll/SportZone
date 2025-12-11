const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/db');

const app = express();
app.use(express.json());
app.use(cors());

// ROUTES IMPORT
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/authRoutes');

const auth = require("./auth/authMiddleware");
const role = require("./auth/roleMiddleware");

// ROUTES
app.use("/api/products", productRoutes);
app.use("/auth", authRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// Protected route example
app.get("/profile", auth, (req, res) => {
    res.json({ message: "User profile", user: req.user });
});

// Admin route example
app.get("/admin-panel", auth, role("admin"), (req, res) => {
    res.json({ message: "Welcome admin" });
});

// START SERVER (always last)
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
