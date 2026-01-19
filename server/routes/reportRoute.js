import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { dailySalesReport } from "../controllers/reportController.js";

const router = express.Router();

//Protected + Admin routes
router.get("/", protect, authorizeRole("admin"), dailySalesReport);

export default router;
