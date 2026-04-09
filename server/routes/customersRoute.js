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
router.put("/:id", protect, updateCustomer);

//Protect + Admin Routes
router.get("/:id", protect, authorizeRole("admin"), getCustomerById);
router.post("/", protect, authorizeRole("admin"), createCustomer);
router.delete("/:id", protect, authorizeRole("admin"), deleteCustomer);

export default router;
