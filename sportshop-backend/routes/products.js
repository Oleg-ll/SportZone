const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/productsController");

// Імпортуємо ОБИДВА middleware
const authMiddleware = require("../auth/authMiddleware"); // <--- Ви це пропустили
const roleMiddleware = require("../auth/roleMiddleware");

// === ПУБЛІЧНІ МАРШРУТИ (доступні всім) ===
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);

// === ЗАХИЩЕНІ МАРШРУТИ (тільки для адміна) ===

router.post("/", authMiddleware, roleMiddleware("Admin"), ProductController.createProduct);

router.put("/:id", authMiddleware, roleMiddleware("Admin"), ProductController.updateProduct);

router.delete("/:id", authMiddleware, roleMiddleware("Admin"), ProductController.deleteProduct);

module.exports = router;