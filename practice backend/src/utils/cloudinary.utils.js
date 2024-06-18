import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const cloudinaryResponce = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(`File uploaded complete at ${cloudinaryResponce.url}`);
    fs.unlinkSync(localFilePath);
    return cloudinaryResponce;
  } catch (error) {
    console.log(`Error on cloudinary : ${error}`);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export default uploadOnCloudinary;
