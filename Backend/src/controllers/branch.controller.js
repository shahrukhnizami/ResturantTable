import { Branch } from "../models/branch.model.js";
import Joi from "joi";
import Table from "../models/table.model.js";
import Camera from "../models/camera.model.js";
import mongoose from "mongoose";



// Joi validation schema
const validateBranchData = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^(\+92|0)?3[0-9]{9}$/)
    .required()
    .trim()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Pakistani number (e.g., +923001234567 or 03001234567).",
    }),
  restaurantId: Joi.string().required(),
});

// add branches by restaurant admin
export const addBranches = async (req, res) => {
  try {
    const { error, value } = validateBranchData.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        error: true,
        message: validationErrors,
      });
    }

    if (value?.restaurantId.toString() !== req?.user?.restaurantId?.toString()) {
      return res.status(403).json({
        error: true,
        message: "You can only add branches for your own restaurant.",
      });
    }

    const isBranchExist = await Branch.findOne({
      name: value.name,
      restaurantId: value.restaurantId,
    });

    if (isBranchExist) {
      return res.status(400).json({
        error: true,
        message: "A branch with the same name already exists for this restaurant.",
      });
    }

    const branch = new Branch(value);
    await branch.save();

    res.status(201).json({
      error: false,
      message: "Branch created successfully",
      branch,
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      message: err.message,
    });
  }
};


export const getSingleBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    if (!branchId || !mongoose.Types.ObjectId.isValid(branchId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid or missing branch ID.",
      });
    }
    const branch = await Branch.findById(branchId);

    if (!branch) {
      return res.status(404).json({
        error: true,
        message: "Branch not found",
      });
    }

    if (branch.restaurantId.toString() !== req.user.restaurantId.toString()) {
      return res.status(403).json({
        error: true,
        message: "You can only retrieve branches for your own restaurant.",
      });
    }
    const branchWithCamerasAndTables = await Branch.aggregate([
      {
        $match: { "_id": new mongoose.Types.ObjectId(branchId) },
      },
      {
        $lookup: {
          from: 'cameras',
          localField: '_id',
          foreignField: 'branchId',
          as: 'cameras',
        },
      },
      {
        $unwind: "$cameras", 
      },
      {
        $lookup: {
          from: 'tables',
          localField: 'cameras._id',
          foreignField: 'cameraId',
          as: 'cameras.tables',
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          address: { $first: "$address" },
          restaurantId: { $first: "$restaurantId" },
          cameras: {
            $push: {
              _id: "$cameras._id",
              cameraId: "$cameras.cameraId",
              cameraIp: "$cameras.cameraIp",
              status: "$cameras.status",
              tables: "$cameras.tables",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          address: 1,
          restaurantId: 1,
          cameras: {
            _id: 1,
            cameraId: 1,
            cameraIp: 1,
            status: 1,
            tables: {
              _id: 1,
              tableId: 1,
              capacity: 1,
              status: 1,
            },
          },
        },
      },
    ]);

    if (!branchWithCamerasAndTables || branchWithCamerasAndTables.length === 0) {
      return res.status(404).json({ error: true, message: "Branch not found" });
    }

    res.status(200).json({
      error: false,
      message: "Branch retrieved successfully",
      data: branchWithCamerasAndTables[0],
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};



const schemaValidation = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  phone: Joi.string()
    .pattern(/^(\+92|0)?3[0-9]{9}$/)
    .optional()
    .trim()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Pakistani number (e.g., +923001234567 or 03001234567).",
    }),
});
// update branch by restaurant admin
export const updateBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    const { error, value } = schemaValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        error: true,
        message: validationErrors,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid branch ID.",
      });
    }

    const branch = await Branch.findById(branchId);

    if (!branch) {
      return res.status(404).json({
        error: true,
        message: "Branch not found",
      });
    }

    if (branch.restaurantId.toString() !== req.user.restaurantId.toString()) {
      return res.status(403).json({
        error: true,
        message: "You can only update branches for your own restaurant.",
      });
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      branchId,
      { $set: value },
      { new: true }
    );

    res.status(200).json({
      error: false,
      message: "Branch updated successfully",
      branch: updatedBranch,
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      message: err.message,
    });
  }
};

// delete branch by id (restaurant admin)
export const deleteBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const branch = await Branch.findByIdAndDelete(branchId);

    if (!branch) {
      return res.status(404).json({ error: true, message: "Branch not found" });
    }

    if (branch.restaurantId.toString() !== req.user.restaurantId.toString()) {
      return res.status(403).json({
        error: true,
        message: "You can only delete branches for your own restaurant.",
      });
    }

    await Table.deleteMany({ branchId });
    await Camera.deleteMany({ branchId });

    res.status(200).json({
      error: false,
      message:
        "Branch and associated data (tables, cameras) deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message || "Internal Server Error" });
  }
};
