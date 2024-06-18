import app from "./app.js";
import connectDB from "./db/db.connection.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: "./.env" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection error at index.js file :: ${error}`);
  });
