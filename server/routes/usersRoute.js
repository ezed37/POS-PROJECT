import express from "express";
import {
  createUser,
  deleteUser,
  getProfile,
  getUser,
  getUserById,
  loginUser,
  updateUser,
} from "../controllers/usersController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

//Public routes
router.post("/login", loginUser);
router.post("/register", createUser);

// Protected route (requires token/ logged in)
router.get("/profile", protect, getProfile);

//Admin only routes
router.get("/", protect, authorizeRole("admin"), getUser); //Only admin can see all users

router
  .route("/:id")
  .put(protect, authorizeRole("admin"), updateUser)
  .delete(protect, authorizeRole("admin"), deleteUser)
  .get(protect, authorizeRole("admin"), getUserById);

export default router;
