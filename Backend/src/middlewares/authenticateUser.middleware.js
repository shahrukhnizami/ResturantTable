import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

let authenticateUser = async (req, res, next) => {
  try {
    let accessToken = req?.headers?.authorization;
    const {id} = req.params;
  
    if (!accessToken) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    accessToken = accessToken.split(" ")[1];
    const decoded = jwt.verify(accessToken, process?.env?.ACCESS_TOKEN_SECRET);
    console.log("accessToken", accessToken);

    if (!decoded) {
      return res.status(401).json({
        error: true,
        message: "Invalid Token",
      });
    }
    
    const user = await User.findById(decoded?._id || id);    
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User Not Found",
      });
    }
    if (user?.isActive === "deactive") {
      return res.status(403).json({
        error: true,
        message: "Your account is deactivated. Please contact the administrator.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
    // console.error(error);
  }
};

export default authenticateUser;
