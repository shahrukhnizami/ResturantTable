import Camera from "../models/camera.model.js";

const checkCameraStatus = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const camera = await Camera.findById(id);
        
        if (!camera) {
            return res.status(404).json({error : true ,  message: "Camera not found" });
        }
        
        if (camera.status !== "active") {
            return res.status(403).json({error : true , message: "Camera is inactive" });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ error : true ,message: "Internal server error", errorDetail: error.message });
    }
};

export default checkCameraStatus;