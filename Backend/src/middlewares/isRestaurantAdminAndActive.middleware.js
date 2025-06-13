import { User } from "../models/user.model.js";

const isRestaurantAdminAndActive = async (req, res, next) => {
  try {
    const { user } = req;
    if (user.role !== "restaurant-admin") {
      return res.status(403).json({
        error: true,
        message: "Access denied. Only restaurant admins can access this route.",
      });
    }

    const dbUser = await User.findById(user._id);
    if (!dbUser || !dbUser?.isActive === "active") {
      return res.status(403).json({
        error: true,
        message: "Your account is deactivated. Please contact the super-admin.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export default isRestaurantAdminAndActive;