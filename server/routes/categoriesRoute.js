import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";

const router = express.Router();

//+Protected routes
router.get("/", protect, getCategory);
router.get("/:id", protect, getCategoryById);

//Protected+Admin routes
// Admin routes
router.post("/", createCategory);
router.put("/:id", protect, authorizeRole("admin"), updateCategory);
router.delete("/:id", protect, authorizeRole("admin"), deleteCategory);

export default router;
