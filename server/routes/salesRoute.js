import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createSale,
  deleteSale,
  getAllSales,
  getSaleById,
} from "../controllers/salesController.js";

const router = express.Router();

//User routes
router.post("/", protect, createSale);
router.get("/", getAllSales);

//Admin routes
router.get("/:id", protect, authorizeRole("admin"), getSaleById);
router.delete("/:id", protect, authorizeRole("admin"), deleteSale);

export default router;
