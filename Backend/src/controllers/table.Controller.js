import Joi from "joi";
import Table from "../models/table.model.js";
import mongoose from "mongoose";
import socketProvider from "../utils/socketProvider.js";

// Get all tables (restaurant admin or admin)
export const getTableData = async (req, res) => {
  try {
    const tableData = await Table.find().populate("cameraId addedBy");
    if (tableData.length === 0) {
      return res.status(404).json({ error: true, message: "No tables found." });
    }
    res.status(200).json({
      error: false,
      message: "Table data fetched successfully",
      data: tableData,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Get single table by ID (restaurant admin or admin)
export const getSingleTableData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid table ID." });
    }
    const table = await Table.findById(id).populate("cameraId addedBy");
    if (!table) {
      return res.status(404).json({ error: true, message: "Table not found." });
    }
    res.status(200).json({
      error: false,
      message: "Table data fetched successfully",
      data: table,
    });
  } catch (error) {
    console.error("Error fetching table data:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const addTableSchema = Joi.object({
  tableId: Joi.string().required().trim(),
  capacity: Joi.number().min(1).required(),
  status: Joi.string().valid("Occupied", "Empty").default("Empty"),
  addedBy: Joi.string().required(),
  cameraId: Joi.string().required(),
});
// Add a new table (restaurant admin or admin)
export const addTableData = async (req, res) => {
  try {
    const { error, value } = addTableSchema.validate(req.body, {
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

    const { tableId, capacity, status, cameraId, addedBy } = value;

    const existingTable = await Table.findOne({ tableId, cameraId });
    if (existingTable) {
      return res.status(400).json({
        error: true,
        message: "Table with this ID already exists.",
      });
    }

    const newTable = new Table({
      tableId,
      capacity,
      status,
      addedBy,
      cameraId,
    });
    const savedTable = await newTable.save();

    res.status(201).json({
      error: false,
      message: "Table added successfully",
      data: savedTable,
    });
  } catch (error) {
    
    res.status(500).json({
      error: true,
      message: "Failed to add table",
      errorDetails: error.message,
    });
  }
};

// Define the schema for validating tableId in request params
const tableIdParamsSchema = Joi.object({
  tableId: Joi.string().required().trim().messages({
    "string.empty": "Table ID is required.",
    "any.required": "Table ID is required.",
  }),
});



// Define the schema for validating the request body
const updateTableSchema = Joi.object({
  status: Joi.string().valid("Occupied", "Empty").required().messages({
    "any.only": "Status must be either 'Occupied' or 'Empty'.",
    "any.required": "Status is required.",
  }),
});

// Update table status (restaurant admin or admin using AI model)
export const updateTableData = async (req, res) => {
  try {
    const { error: paramsError, value: paramsValue } =
      tableIdParamsSchema.validate(req.params);
    const { error: bodyError, value: bodyValue } = updateTableSchema.validate(
      req.body
    );

    if (paramsError || bodyError) {
      return res.status(400).json({
        error: true,
        message: "Validation failed. Please check your input.",
        details: {
          params: paramsError ? paramsError.details.map((d) => d.message) : [],
          body: bodyError ? bodyError.details.map((d) => d.message) : [],
        },
      });
    }

    const { tableId } = paramsValue;
    const { status } = bodyValue;

    if (!mongoose.Types.ObjectId.isValid(tableId) && tableId.length !== 24) {
      return res.status(400).json({
        error: true,
        message: "Invalid table ID",
      });
    }

    // Update the table status in the database
    const updatedTable = await Table.findOneAndUpdate(
      { _id: tableId },
      { status },
      { new: true }
    ).populate("cameraId addedBy");

    if (!updatedTable) {
      return res.status(404).json({
        error: true,
        message: `Table with ID ${tableId} not found.`,
      });
    }

    // Emit socket event
    try {
      socketProvider("tableUpdatedData", JSON.stringify(updatedTable));
      console.log("Socket event emitted: tableUpdatedData");
    } catch (socketError) {
      console.error("Error emitting socket event:", socketError);
    }

    console.log(updatedTable);

    res.status(200).json({
      error: false,
      message: "Table status updated successfully.",
      data: updatedTable,
    });
  } catch (error) {
    console.error("Error updating table status:", error.message);
    res.status(500).json({
      error: true,
      message: "Failed to update table status due to a server error.",
      errorDetails: error.message,
    });
  }
};

export const deleteSingleTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Table ID is required.",
      });
    }

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({
        error: true,
        message: "Table not found.",
      });
    }

    if (table.addedBy.toString() !== user._id.toString()) {
      return res.status(403).json({
        error: true,
        message: "Access denied. You can only delete tables that you added.",
      });
    }

    await Table.findByIdAndDelete(id);

    return res.status(200).json({
      error: false,
      message: "Table deleted successfully.",
      data: table,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};
