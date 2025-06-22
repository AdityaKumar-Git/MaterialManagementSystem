import { Router } from "express";
import {
  createTender,
  getAllTenders,
  getTenderById,
  updateTenderStatus,
} from "../controllers/tender.controller.js";
import { verifyJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllTenders);
router.get("/:id", getTenderById);

// Protected routes - only admin can access
router.post("/", verifyJWT, createTender);
router.patch("/:id/status", verifyJWT, updateTenderStatus);
router.patch("/:id/close", verifyJWT, updateTenderStatus);

export default router; 