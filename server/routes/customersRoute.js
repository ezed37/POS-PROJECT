import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerById,
  updateCustomer,
} from "../controllers/customersController.js";

const router = express.Router();

//Protected routes
router.get("/", protect, getCustomer);
router.post("/", protect, createCustomer);

//Protect + Admin Routes
router.get("/:id", protect, authorizeRole("admin"), getCustomerById);
router.put("/:id", protect, authorizeRole("admin"), updateCustomer);
router.delete("/:id", protect, authorizeRole("admin"), deleteCustomer);

export default router;
