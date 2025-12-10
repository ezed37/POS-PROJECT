import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateBulkProduct,
  updateProduct,
} from "../controllers/productsController.js";

const router = express.Router();

//+Protected routes
router.get("/", protect, getProduct);
router.get("/:id", protect, getProductById);
router.put("/", protect, updateBulkProduct);

//Protected+Admin routes
// Admin routes
router.post("/", protect, authorizeRole("admin"), createProduct);
router.put("/:id", protect, authorizeRole("admin"), updateProduct);
router.delete("/:id", protect, authorizeRole("admin"), deleteProduct);

export default router;
