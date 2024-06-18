import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import dbConnection from "./db/connection.db.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

dbConnection()
  .then(() => {
    app.on("error", (error) => {
      console.log(`Error after MongoDb connection : ${error}`);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Mongodb connection error : ${error}`);
    process.exit(1);
  });
