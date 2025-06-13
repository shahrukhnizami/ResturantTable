import { BlacklistToken } from "../models/blacklistToken.model.js";

export const isTokenBlacklisted = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized: No token provided" });
    }

    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized: Token is blacklisted" });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server error",
      errorDetail: error.message,
    });
  }
};
