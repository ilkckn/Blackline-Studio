import { Router } from "express";
import { getMe, getAllUsers, getUserById, updateUser, updateUserRole, deactivateUser, reactivateUser } from "../controller/userController.js";
import { auth, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/me", auth, getMe);
router.get("/all-users", auth, admin, getAllUsers);
router.get("/user/:id", auth, getUserById);

router.put("/update-profile/:id", auth, updateUser);
router.put("/update-role/:id", auth, admin, updateUserRole);
router.put("/deactivate/:id", auth, deactivateUser);
router.put("/reactivate/:id", auth, admin, reactivateUser);

export default router;