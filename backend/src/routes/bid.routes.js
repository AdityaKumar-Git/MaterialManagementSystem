import { Router } from "express";
import { verifyJWT as verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import {
  submitBid,
  getTenderBids,
  updateBidStatus,
  generateBill,
  deleteAllBids
} from "../controllers/bid.controller.js";

const router = Router();

// Public routes
router.post("/submit/:tenderId", submitBid);

// Protected routes - only admin can access
router.use(verifyAdminJWT);
router.get("/tender/:tenderId/bids", getTenderBids);
router.patch("/bid/:bidId/status", updateBidStatus);
router.patch("/bid/deleteAllBids", deleteAllBids);
router.get("/bid/:bidId/bill", generateBill);

export default router; 