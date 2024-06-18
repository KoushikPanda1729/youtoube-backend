import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("Error occured at cloudinary ::", error);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted old image with public ID: ${publicId}`);
  } catch (error) {
    console.error("Error deleting old image from Cloudinary", error);
    throw new Error("Failed to delete old image from Cloudinary");
  }
};

export default uploadOnCloudinary;
