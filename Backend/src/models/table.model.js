import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Occupied", "Empty"],
      default: "Empty",
    },
    capacity: { type: Number, required: true, min: 1 },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    cameraId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camera",
    }
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);
export default Table;