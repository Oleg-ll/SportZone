const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productsController");

// CRUD
router.get("/", ProductController.getAllProducts);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
