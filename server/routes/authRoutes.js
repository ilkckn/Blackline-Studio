import { Router } from "express";
import { registerUser, changePassword, loginUser, logoutUser } from "../controller/authController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/change-password/:id", auth, changePassword);

export default router;