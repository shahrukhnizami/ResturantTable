import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import isSuperAdmin from "../middlewares/isSuperAdmin.middleware.js";
import { isTokenBlacklisted } from "../middlewares/isTokenBlacklisted.middleware.js";

const router = Router();

router.get("/stats", authenticateUser, isTokenBlacklisted, isSuperAdmin , getDashboardStats);


export default router;
