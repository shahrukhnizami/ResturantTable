import Joi from "joi";
import Camera from "../models/camera.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Branch } from "../models/branch.model.js";

// Get single camera by camera ID and its associated tables
export const getCameraById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid camera ID." });
    }

    const cameraId = new mongoose.Types.ObjectId(id);
    const cameraWithTables = await Camera.aggregate([
      {
        $match: { _id: cameraId },
      },
      {
        $lookup: {
          from: "tables",
          localField: "_id",
          foreignField: "cameraId",
          as: "tables",
        },
      },
      {
        $project: {
          _id: 1,
          cameraId: 1,
          cameraIp: 1,
          status: 1,
          branchId: 1,
          tables: {
            _id: 1,
            tableId: 1,
            capacity: 1,
            status: 1,
            addedBy: 1,
          },
        },
      },
    ]);

    if (!cameraWithTables || cameraWithTables.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No camera found for the specified camera ID.",
      });
    }

    res.status(200).json({
      error: false,
      message: "Camera retrieved successfully with tables.",
      data: cameraWithTables[0],
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Get all cameras by restaurant ID
export const getAllCamerasByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const branches = await Branch.find({ restaurantId }).select("_id");

    if (!branches || branches.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No branches found for the specified restaurant.",
      });
    }

    const branchIds = branches.map((branch) => branch._id);

    const camerasWithTables = await Camera.aggregate([
      {
        $match: { branchId: { $in: branchIds } },
      },
      {
        $lookup: {
          from: "tables",
          localField: "_id",
          foreignField: "cameraId",
          as: "tables",
        },
      },
      {
        $project: {
          _id: 1,
          cameraId: 1,
          cameraIp: 1,
          status: 1,
          branchId: 1,
          tables: {
            _id: 1,
            tableId: 1,
            capacity: 1,
            status: 1,
            addedBy: 1,
          },
        },
      },
    ]);

    if (!camerasWithTables || camerasWithTables.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No cameras found for the specified restaurant.",
      });
    }

    res.status(200).json({
      error: false,
      message: "Cameras retrieved successfully with tables.",
      data: camerasWithTables,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: true,
        message: "Internal server error",
        errorDetail: error.message,
      });
  }
};

// Get all cameras of all branches
export const getAllCameras = async (req, res) => {
  try {
    const camerasWithTables = await Camera.aggregate([
      {
        $match: { status: { $ne: "inactive" } },
      },
      {
        $lookup: {
          from: "tables",
          localField: "_id",
          foreignField: "cameraId",
          as: "tables",
        },
      },
      {
        $project: {
          _id: 1,
          cameraId: 1,
          cameraIp: 1,
          status: 1,
          branchId: 1,
          tables: {
            _id: 1,
            tableId: 1,
            capacity: 1,
            status: 1,
            addedBy: 1,
          },
        },
      },
    ]);

    if (!camerasWithTables || camerasWithTables.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No cameras found.",
      });
    }

    res.status(200).json({
      error: false,
      message: "Cameras retrieved successfully with tables.",
      data: camerasWithTables,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const cameraSchema = Joi.object({
  cameraId: Joi.string().required(),
  cameraIp: Joi.string()
    .ip({ version: ["ipv4", "ipv6"] })
    .required(),
  status: Joi.string().valid("active", "inactive").required().default("active"),
  branchId: Joi.string().required(),
});

export const createCamera = async (req, res) => {
  const { error, value } = cameraSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });
  }

  try {
    const isCameraIdExists = await Camera.findOne({ cameraId: value.cameraId });
    if (isCameraIdExists) {
      return res
        .status(400)
        .json({ error: true, message: "Camera ID already exists" });
    }

    const isCameraIpExistsInBranch = await Camera.findOne({
      cameraIp: value.cameraIp,
      branchId: value.branchId,
    });
    
    if (isCameraIpExistsInBranch) {
      return res.status(400).json({
        error: true,
        message: "Camera IP already exists in this branch",
      });
    }

    const newCamera = new Camera(value);
    await newCamera.save();
    res.status(201).json({
      error: false,
      message: "Camera created successfully",
      data: newCamera,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};


const cameraUpdateSchema = Joi.object({
  cameraId: Joi.string().optional(),
  cameraIp: Joi.string()
    .ip({ version: ["ipv4", "ipv6"] })
    .required()
    .messages({ "string.ip": "Invalid IP address format" }),
});

// Update a Camera by ID only for restaurant admins or lower admin
export const updateCamera = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = cameraUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedCamera = await Camera.findOneAndUpdate({ _id: id }, value, {
      new: true,
    });

    if (!updatedCamera) {
      return res.status(404).json({ error: true, message: "Camera not found" });
    }

    res.json({
      error: false,
      message: "Camera updated successfully",
      data: updatedCamera,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// 6. Activate/Deactivate a Camera by ID only for restaurant admins or lower admin
export const updateCameraStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid Camera ID" });
    }

    const requestingUser = await User.findById(req.user._id);
    if (!requestingUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const camera = await Camera.findById(id);
    if (!camera) {
      return res.status(404).json({ error: true, message: "Camera not found" });
    }

    const newStatus = camera.status === "active" ? "inactive" : "active";

    const updatedCamera = await Camera.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    const action = updatedCamera.status === "active" ? "active" : "inactive";

    res.status(200).json({
      error: false,
      message: `Camera ${action} successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
