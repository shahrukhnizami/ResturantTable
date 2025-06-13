import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";

export const refreshTokenMiddleware = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      error: true,
      message: "Refresh token is required.",
    });
  }

  try {
    
    const isBlacklisted = await BlacklistToken.findOne({ token: refreshToken });

    if (isBlacklisted) {
      return res.status(401).json({
        error: true,
        message: "Token has been revoked. Please log in again.",
      });
    }

    
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

 
    const user = await User.findById(decoded?._id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found.",
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        error: true,
        message: "Invalid refresh token.",
      });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } 
    );

    req.newAccessToken = newAccessToken;

    
    next();
  } catch (error) {
    console.error("Error in refreshTokenMiddleware:", error.message);
    res.status(401).json({
      error: true,
      message: "Invalid or expired refresh token.",
      errorDetails: error.message,
    });
  }
};
