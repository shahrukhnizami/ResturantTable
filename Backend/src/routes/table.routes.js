import { Router } from "express";
import {
  addTableData,
  getTableData,
  getSingleTableData,
  updateTableData,
  deleteSingleTable
} from "../controllers/table.Controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import isRestaurantAdminAndActive from "../middlewares/isRestaurantAdminAndActive.middleware.js";
import isAdminAndActive from "../middlewares/isAdminAndActive.middleware.js";
import { isTokenBlacklisted } from "../middlewares/isTokenBlacklisted.middleware.js";

const router = Router();

router.get(
  "/",
  authenticateUser,
  isTokenBlacklisted,
  isRestaurantAdminAndActive,
  isAdminAndActive,
  getTableData
);
router.get(
  "/:id",
  authenticateUser,
  isTokenBlacklisted,
  isRestaurantAdminAndActive,
  isAdminAndActive,
  getSingleTableData
);
router.post(
  "/create",
  authenticateUser,
  isTokenBlacklisted,
  isRestaurantAdminAndActive,
  isAdminAndActive,
  addTableData
);
router.put("/update/:tableId",  updateTableData);
router.delete('/:id', authenticateUser, isTokenBlacklisted ,isRestaurantAdminAndActive , isAdminAndActive , deleteSingleTable) ;

export default router;
