import { User } from "../models/user.model.js";

const isAdminAndActive = async (req, res, next) => {
  try {
    const { user } = req;
    if (user.role === "admin" || user.role === "restaurant-admin") {
      const dbUser = await User.findById(user._id);
      if (dbUser?.isActive === "active") {
        return next(); 
      }
      return res.status(403).json({
        error: true,
        message: "Your account is deactivated. Please contact the super-admin.",
      });
    }

    return res.status(403).json({
      error: true,
      message: "Access denied. Only admin or restaurant admin can access this route.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};


export default isAdminAndActive;