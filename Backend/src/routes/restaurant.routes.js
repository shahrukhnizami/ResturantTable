import { Router } from "express";
import {
  addRestaurant,
  getAllRestaurant,
  getRestaurantById,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";
import isSuperAdmin from "../middlewares/isSuperAdmin.middleware.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import { isTokenBlacklisted } from "../middlewares/isTokenBlacklisted.middleware.js";

const router = Router();
router.get("/", authenticateUser, isTokenBlacklisted,isSuperAdmin, getAllRestaurant);
router.post("/create", authenticateUser,isTokenBlacklisted, isSuperAdmin, addRestaurant);
router.get("/:id", authenticateUser,isTokenBlacklisted,  getRestaurantById);
router.delete("/:id", authenticateUser, isTokenBlacklisted,isSuperAdmin, deleteRestaurant);

export default router;
