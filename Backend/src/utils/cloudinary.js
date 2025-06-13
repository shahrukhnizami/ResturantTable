import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!fs.existsSync(localFilePath)) {
      throw new Error("Local file does not exist.");
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "restaurant-automation",
      resource_type: "auto",
    });

    console.log("File uploaded to Cloudinary:", response.secure_url);

    fs.unlinkSync(localFilePath);
    console.log("Local file deleted:", localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted due to upload error:", localFilePath);
    }
    console.error("Error uploading to Cloudinary:", error);
  }
};

export const deleteFromCloudinary = async (publicId = "") => {
  try {
    console.log("Deleting file from cloudinary with publicId:", publicId);
    const result = await cloudinary.uploader.destroy(`restaurant-automation/${publicId}`)
    console.log("Cloudinary deletion result:", result);

    if (result.result === "ok") {
      console.log("File deleted successfully from Cloudinary.");
    } else {
      console.error("Failed to delete file from Cloudinary:", result);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};
