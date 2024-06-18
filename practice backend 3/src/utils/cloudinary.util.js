import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uplodaOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const cloudinaryResponce = await cloudinary.uploader.upload(localFilePath);
    console.log(`File uploaded successfully :: ${cloudinaryResponce.url}`);
    fs.unlinkSync(localFilePath);
    return cloudinaryResponce;
  } catch (error) {
    console.log(`Error occured at cloudinary upload section ${error}`);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteOnCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};
export default uplodaOnCloudinary;
