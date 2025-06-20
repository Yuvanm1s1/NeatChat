import express from "express"
import { login, logout, signup, updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router =express.Router();
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
//if the user wants to update profile first we need to check if they are authenticated, so we use protectRoute
router.put("/update-profile",protectRoute,updateProfile)

router.get("/check",protectRoute,checkAuth)
export default router;