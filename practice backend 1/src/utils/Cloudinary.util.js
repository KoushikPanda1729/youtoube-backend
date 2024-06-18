import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const cloudinaryResponce = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploded on cloudinary : ", cloudinaryResponce.url);
    fs.unlinkSync(localFilePath);
    return cloudinaryResponce;
  } catch (error) {
    console.log("Error occured while uploading on cloudinary : ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export default uploadOnCloudinary;
