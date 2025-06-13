import Joi from "joi";
import { Restaurant } from "../models/restaurant.model.js";
import { Branch } from "../models/branch.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import Camera from "../models/camera.model.js";
import Table from "../models/table.model.js";

const validateRestaurantData = Joi.object({
  restaurantName: Joi.string().required().trim(),
  address: Joi.string().required().trim(),
  phone: Joi.string()
    .pattern(/^(\+92|0)?3[0-9]{9}$/)
    .required()
    .trim()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Pakistani number (e.g., +923001234567 or 03001234567).",
    }),
  email : Joi.string().email().required().trim(),
  createdBy: Joi.string().required().trim(),
 
});


// add restaurant (by super admin)
export const addRestaurant = async (req, res) => {
  try {
    const { error, value } = validateRestaurantData.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        error: true,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const isRestaurantExist = await Restaurant.findOne(value)
    if (isRestaurantExist) {
      return res.status(400).json({
        error: true,
        message: "Restaurant already exists",
      });
    }

    const restaurant = new Restaurant(value);
    await restaurant.save();

    res.status(201).json({
      error: false,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (err) {
    res.status(400).json({ error: false, message: err.message });
  }
};

// Get all restaurant data (only super admin)
export const getAllRestaurant = async (req, res) => {
  try {
    const { sortBy, limit } = req.query;
    const pipeline = [
      {
        $lookup: {
          from: "branches", 
          localField: "_id",
          foreignField: "restaurantId",
          as: "branches", 
        },
      },
      {
        $project: {
          _id: 1,
          restaurantName: 1,
          address: 1,
          phone: 1,
          email: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          branches: {
            _id: 1,
            name: 1,
            address: 1,
            phone: 1,
          },
        },
      },
    ];
    
    if (sortBy) {
      pipeline.push({ $sort: {sortBy: 1} });
    }
    if (limit) {
      pipeline.push({ $limit: parseInt(limit) });
    }
    const restaurants = await Restaurant.aggregate(pipeline);

    if (restaurants.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No restaurants found." });
    }

    res.status(200).json({
      error: false,
      message: "Restaurant data fetched successfully.",
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};


// Get single restaurant data by id (only super admin)
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const {user} = req;
    if(user.role !== 'super-admin' && user.role !== 'restaurant-admin'){
      return res.status(401).json({
        error: true,
        message: "only super admin and restaurant admin can access this route",
      });
    }

     if (!mongoose.Types.ObjectId.isValid(id) && id.length !== 24) {
      return res.status(400).json({
        error: true,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(`${id}`) },
      },
      {
        $lookup: {
          from: "branches", 
          localField: "_id",
          foreignField: "restaurantId",
          as: "branches", 
        },
      },
      {
        $project: {
          _id: 1,
          restaurantName: 1,
          address: 1,
          phone: 1,
          email : 1,
          createdAt:1,
          updatedAt: 1,
          createdBy: 1,
          branches: {
            _id: 1,
            name: 1,
            address: 1,
            phone: 1,
            createdAt: 1,
          },
        },
      },
    ]);

    if (!restaurant || restaurant.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Restaurant not found." });
    }

    res.status(200).json({
      error: false,
      message: "Restaurant fetched successfully.",
      data: restaurant[0], 
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message || "Internal Server Error" });
  }
};



export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ error: true, message: "Restaurant not found." });
    }

    const branches = await Branch.find({ restaurantId: id });
    const branchIds = branches.map(branch => branch._id);
    await Branch.deleteMany({ restaurantId: id });

    // Delete users linked to the restaurant
    await User.deleteMany({ restaurantId: id });

    // Find and delete cameras linked to the deleted branches
    const cameras = await Camera.find({ branchId: { $in: branchIds } });
    const cameraIds = cameras.map(camera => camera._id);
    await Camera.deleteMany({ branchId: { $in: branchIds } });

    // Delete tables linked to the deleted cameras
    await Table.deleteMany({ cameraId: { $in: cameraIds } });

    res.status(200).json({
      error: false,
      message: "Restaurant and all associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ error: true, message: error.message || "Internal Server Error" });
  }
};



