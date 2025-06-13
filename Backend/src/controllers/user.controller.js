import Joi from "joi";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";
import { BlacklistToken } from "../models/blacklistToken.model.js";

// Route to get all users (only restaurant admin and super admin can access)
export const getAllUser = async (req, res) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password -refreshToken")
      .populate("restaurantId");

    res.status(200).json({
      error: false,
      message: "Users fetched successfully!",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const getLoginData = async (req, res) => {
  try {
    const { user } = req;

    const populatedUser = await User.aggregate([
      {
        $match: {
          _id: user._id,
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $unwind: {
          path: "$restaurant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          role: 1,
          username: 1,
          restaurantId: 1,
          profilePicture: 1,
          phone: 1,
          restaurant: {
            restaurantName: 1,
            address: 1,
            phone: 1,
            email: 1,
            createdAt: 1,
          },
        },
      },
    ]);

    if (populatedUser.length === 0) {
      return res.status(404).json({
        error: true,
        message: "User not found!",
      });
    }

    const userData = populatedUser[0];
    userData.password = undefined;

    return res.status(200).json({
      error: false,
      message: "User data fetched successfully!",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Internal server error!",
    });
  }
};

// COMPLETE LOGIN FLOW
const validateLoginData = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(6).required().trim(),
});

export const loginUser = async (req, res) => {
  try {
    const { error, value } = validateLoginData.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({ email: value.email });

    if (user?.isActive === "deactive") {
      return res.status(403).json({
        error: true,
        message:
          "Your account is deactivated. Please contact the administrator.",
      });
    }

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: true, message: "Invalid password" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      error: false,
      message: "Login successful!",
      data: {
        user: {
          id: user._id,
          restaurant_name: user.restaurant_name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message || "Internal server error!",
    });
  }
};

// complete user register flow
const validateUserData = Joi.object({
  username: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(6).required().trim(),
  restaurantId: Joi.string().required().trim(),
});
// only super admin can create restaurant admin
export const createRestaurantAdmin = async (req, res) => {
  try {
    const { username, email, password, restaurantId } = req.body;
    const { error } = validateUserData.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }
    let isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({
        error: true,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "restaurant-admin",
      isActive: "active",
      restaurantId,
    });

    user = await user.save();

    res.status(201).json({
      error: false,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// only super admin can chnage activation restaurant admin
// Only super admin can change activation status of a restaurant admin
export const restaurantAdminActivation = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurantAdmin = await User.findById(id);

    if (!restaurantAdmin) {
      return res.status(404).json({
        error: true,
        message: "Restaurant admin not found",
      });
    }

    if (restaurantAdmin.role !== "restaurant-admin") {
      return res.status(400).json({
        error: true,
        message: "User is not a restaurant admin",
      });
    }

    const newStatus =
      restaurantAdmin?.isActive === "active" ? "deactive" : "active";
    restaurantAdmin.isActive = newStatus;
    await restaurantAdmin.save();

    const action = newStatus === "active" ? "activated" : "deactivated";
    res.status(200).json({
      error: false,
      message: `Restaurant admin ${action} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const validateCreateLowerAdmin = Joi.object({
  username: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(6).required().trim(),
});

// Only restaurant admin can create lower admin
export const createLowerAdmin = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user._id);

    const { error, value } = validateCreateLowerAdmin.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        error: true,
        message: validationErrors || "Validation failed",
      });
    }

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);

    const newUser = new User({
      username: value.username,
      email: value.email,
      password: hashedPassword,
      role: "admin",
      isActive: "active",
      restaurantId: requestingUser.restaurantId,
    });

    await newUser.save();
    res.status(201).json({
      error: false,
      message: "Lower admin created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Only restaurant admin can handle activation of lower admin
export const activationLowerAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUser = await User.findById(req.user._id);
    const lowerAdmin = await User.findById(id);

    if (!lowerAdmin) {
      return res.status(404).json({
        error: true,
        message: "Lower admin not found",
      });
    }

    if (requestingUser.role !== "restaurant-admin") {
      return res.status(403).json({
        error: true,
        message:
          "Only restaurant admins can activate or deactivate lower admins",
      });
    }

    if (
      lowerAdmin.restaurantId.toString() !==
      requestingUser.restaurantId.toString()
    ) {
      return res.status(403).json({
        error: true,
        message: "You can only activate lower admins from your own restaurant",
      });
    }

    if (lowerAdmin.role !== "admin") {
      return res.status(400).json({
        error: true,
        message: "User is not a lower admin",
      });
    }

    const newStatus = lowerAdmin?.isActive === "active" ? "deactive" : "active";
    lowerAdmin.isActive = newStatus;
    await lowerAdmin.save();

    const action = newStatus === "active" ? "activated" : "deactivated";
    res.status(200).json({
      error: false,
      message: `Lower admin ${action} successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Validation schema for profile updates
const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
}).min(1);

const updateProfileImageSchema = Joi.object({
  profilePicture: Joi.string().optional(),
});

export const updateUserProfile = async (req, res) => {
  try {
    const { user } = req;
    const file = req.file;

    // Validate the request body
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    if (file) {
      const { error: fileError } = updateProfileImageSchema.validate({
        profilePicture: file.filename,
      });
      if (fileError) {
        return res.status(400).json({
          error: true,
          message: "Validation error",
          details: fileError.details.map((detail) => detail.message),
        });
      }

      const oldImageUrl = user.profilePicture;

      if (oldImageUrl) {
        const publicId = oldImageUrl.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }

      // Upload the file to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(
        file.path,
        oldImageUrl
      );
      if (!cloudinaryResponse) {
        return res.status(500).json({
          error: true,
          message: "Failed to upload profile image to Cloudinary",
        });
      }
      user.profilePicture = cloudinaryResponse.secure_url;
    }

    if (value.username !== undefined) {
      user.username = value.username;
    }
    if (value.phone !== undefined) {
      user.phone = value.phone;
    }

    const updatedUser = await user.save();

    // Prepare the response
    const userResponse = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      restaurantId: updatedUser.restaurantId,
      profilePicture: updatedUser.profilePicture,
      phone: updatedUser.phone,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return res.status(200).json({
      error: false,
      message: "Profile updated successfully.",
      data: userResponse,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
      console.log("Local file deleted due to upload error:", req.file.path);
    }

    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// route to logout a user
export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.user.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        error: true,
        message: "No refresh token found. User is already logged out.",
      });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      return res.status(404).json({ error: true, message: "User not found" });
    }

    user.refreshToken = null;
    await user.save();

    const accessToken = req.headers.authorization?.split(" ")[1];
    if (accessToken) {
      await BlacklistToken.create({ token: accessToken });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ error: false, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: true,
      message: error.message || "Internal server error",
    });
  }
};

// route to verif token
export const verifyToken = async (req, res) => {
  try {
    res.status(200).json({
      error: false,
      message: "Refresh token is valid",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal Server error",
      details: error.message,
    });
  }
};


export const refreshToken = async (req, res) => {
  try {
    const newAccessToken = req.newAccessToken

    if (!newAccessToken) {
      return res.status(401).json({
        error: true,
        message: "Failed to generate access token",
      });
    }

    res.status(200).json({
      error: false,
      message: "Access token generated successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: error.message,
    });
  }
};



