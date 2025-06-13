import { Router } from "express";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import isSuperAdmin from "../middlewares/isSuperAdmin.middleware.js";
import {
  createLowerAdmin,
  activationLowerAdmin,
  createRestaurantAdmin,
  getLoginData,
  loginUser,
  getAllUser,
  restaurantAdminActivation,
  updateUserProfile,
  logoutUser,
  verifyToken,
  refreshToken,
} from "../controllers/user.controller.js";
import isRestaurantAdminAndActive from "../middlewares/isRestaurantAdminAndActive.middleware.js";
import { refreshTokenMiddleware } from "../middlewares/refreshToken.middleware.js";
import isAdminAndActive from "../middlewares/isAdminAndActive.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isTokenBlacklisted } from "../middlewares/isTokenBlacklisted.middleware.js";

const router = Router();

router.get("/", authenticateUser, isTokenBlacklisted, getLoginData);
router.get(
  "/allUsers",
  authenticateUser,
  isTokenBlacklisted,
  isSuperAdmin,
  getAllUser
);
router.post("/login", loginUser);
router.post(
  "/create/restaurant-admin",
  authenticateUser,
  isTokenBlacklisted,
  isSuperAdmin,
  createRestaurantAdmin
);

router.patch(
  "/updateprofile",
  authenticateUser,
  isTokenBlacklisted,
  upload.single("image"),
  updateUserProfile
);

router.patch(
  "/restaurant-admin/activation/:id",
  authenticateUser,
  isTokenBlacklisted,
  isSuperAdmin,
  restaurantAdminActivation
);

router.post(
  "/create/admin",
  authenticateUser,
  isTokenBlacklisted,
  isRestaurantAdminAndActive,
  createLowerAdmin
);

router.patch(
  "/admin/activation/:id",
  authenticateUser,
  isRestaurantAdminAndActive,
  activationLowerAdmin
);

router.post("/refreshToken", refreshTokenMiddleware, refreshToken);
router.get("/verify-token", authenticateUser, isTokenBlacklisted, verifyToken);
router.post("/logout", authenticateUser, isTokenBlacklisted, logoutUser);

export default router;
