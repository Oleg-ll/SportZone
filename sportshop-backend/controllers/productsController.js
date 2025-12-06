const db = require("../db/db");

module.exports = {
    getAllProducts: (req, res) => {
        db.query("SELECT * FROM products", (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    },

    createProduct: (req, res) => {
        const { ProductName, Description, Price, Stock, CategoryID, ImageURL } = req.body;

        const sql = `
            INSERT INTO products (ProductName, Description, Price, Stock, CategoryID, ImageURL)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [ProductName, Description, Price, Stock, CategoryID, ImageURL], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Product added", id: result.insertId });
        });
    },

    updateProduct: (req, res) => {
        const { ProductName, Description, Price, Stock, CategoryID, ImageURL } = req.body;

        const sql = `
            UPDATE products
            SET ProductName=?, Description=?, Price=?, Stock=?, CategoryID=?, ImageURL=?
            WHERE ProductID=?
        `;

        db.query(sql, [ProductName, Description, Price, Stock, CategoryID, ImageURL, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Product updated" });
        });
    },

    deleteProduct: (req, res) => {
        db.query("DELETE FROM products WHERE ProductID=?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Product deleted" });
        });
    }
};
