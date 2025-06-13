import { Router } from "express";
import { addBranches, deleteBranch, getSingleBranch, updateBranch } from "../controllers/branch.controller.js";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import isRestaurantAdminAndActive from "../middlewares/isRestaurantAdminAndActive.middleware.js";
import isAdminAndActive from "../middlewares/isAdminAndActive.middleware.js";
import { isTokenBlacklisted } from "../middlewares/isTokenBlacklisted.middleware.js";
const router = Router();

// router.get('/:restaurantId' ,authenticateUser,isRestaurantAdminAndActive , isAdminAndActive,  getBranches);
router.get('/:branchId' ,authenticateUser ,isTokenBlacklisted,isRestaurantAdminAndActive, isAdminAndActive , getSingleBranch);
router.post('/create' , authenticateUser,isTokenBlacklisted , isRestaurantAdminAndActive ,  addBranches);
router.delete('/:branchId' ,authenticateUser ,isTokenBlacklisted, isRestaurantAdminAndActive ,  deleteBranch);
router.put('/update/:branchId' ,authenticateUser,isTokenBlacklisted , isRestaurantAdminAndActive ,  updateBranch);

export default router;
