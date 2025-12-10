import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrandById,
  updateBrand,
} from "../controllers/brandsController.js";

const router = express.Router();

//+Protected routes
router.get("/", protect, getBrand);
router.get("/:id", protect, getBrandById);

//Protected+Admin routes
// Admin routes
router.post("/", createBrand);
router.put("/:id", protect, authorizeRole("admin"), updateBrand);
router.delete("/:id", protect, authorizeRole("admin"), deleteBrand);

export default router;
