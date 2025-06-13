import { Router } from "express";
import tableRoute from "./table.routes.js";
import userRoute from "./user.routes.js";
import branchRoute from "./branch.routes.js";
import restaurantRoute from "./restaurant.routes.js";
import cameraRoutes from "./camera.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/table", tableRoute);
router.use("/user", userRoute);
router.use("/restaurant", restaurantRoute);
router.use("/branch", branchRoute);
router.use("/camera", cameraRoutes);
router.use("/dashboard" , dashboardRoutes )


export default router;
