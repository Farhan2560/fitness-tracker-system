import express from "express";
import rateLimit from "express-rate-limit";
import {
  UserLogin,
  UserRegister,
  getUserDashboard,
  getWorkoutsByDate,
  addWorkout,
  deleteWorkout,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Strict rate limit for authentication endpoints (15 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, UserRegister);
router.post("/signin", authLimiter, UserLogin);

router.get("/dashboard", apiLimiter, verifyToken, getUserDashboard);
router.get("/workout", apiLimiter, verifyToken, getWorkoutsByDate);
router.post("/workout", apiLimiter, verifyToken, addWorkout);
router.delete("/workout/:id", apiLimiter, verifyToken, deleteWorkout);

export default router;
