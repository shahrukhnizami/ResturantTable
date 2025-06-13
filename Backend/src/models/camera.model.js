import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema({
  cameraId: { type: String, required: true},
  cameraIp: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  branchId : { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
});

const Camera = mongoose.model('Camera', cameraSchema);
export default Camera;