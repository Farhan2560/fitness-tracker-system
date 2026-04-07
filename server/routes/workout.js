import express from "express";
import rateLimit from "express-rate-limit";
import { getWorkoutCategories } from "../controllers/workout.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/categories", apiLimiter, verifyToken, getWorkoutCategories);

export default router;
