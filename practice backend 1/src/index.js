import app from "./app.js";
import dbConnection from "./db/db.connection.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config({ path: "./.env" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


dbConnection()
  .then(() => {
    app.on("Error", (error) => {
      console.log("Some error occured after DB connection : ", error);
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log("App is running at port : ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error : ", error);
  });
