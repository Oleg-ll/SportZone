const db = require("../db/db");

module.exports = {
    getAllProducts: (req, res) => {
        db.query("SELECT * FROM products", (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    },

    getProductById: (req, res) => {
        const sql = "SELECT * FROM products WHERE ProductID = ?";
        db.query(sql, [req.params.id], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            
            if (results.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json(results[0]);
        });
    },

    createProduct: (req, res) => {
        const { ProductName, Description, Price, Stock, CategoryID, ImageURL } = req.body;
        
        // Перевірка на валідність даних
        if (!ProductName || !Price) {
            return res.status(400).json({ message: "Name and Price are required" });
        }

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
        console.log("Отримано запит на оновлення ID:", req.params.id);
        console.log("Дані:", req.body);

        const { ProductName, Description, Price, Stock, CategoryID, ImageURL } = req.body;

        const sql = `
            UPDATE products
            SET ProductName=?, Description=?, Price=?, Stock=?, CategoryID=?, ImageURL=?
            WHERE ProductID=?
        `;

        // Увага: додали аргумент result
        db.query(sql, [ProductName, Description, Price, Stock, CategoryID, ImageURL, req.params.id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }

            // Перевіряємо, чи був змінений хоч один рядок
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Товар не знайдено або дані не змінилися" });
            }

            res.json({ message: "Product updated" });
        });
    },

    deleteProduct: (req, res) => {
        // Увага: додали аргумент result
        db.query("DELETE FROM products WHERE ProductID=?", [req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: err });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Товар не знайдено" });
            }

            res.json({ message: "Product deleted" });
        });
    }
};