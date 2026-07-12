import express from "express";
import { registerUser, loginUser, getMe, logoutUser } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validators/authValidator.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

export default router;
