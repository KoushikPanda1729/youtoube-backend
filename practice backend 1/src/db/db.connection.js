import mongoose from "mongoose";
import { DB_NAME } from "./../constant.js";

const dbConnection = async () => {
  try {
    const dbObject = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("Host : ", dbObject.connection.host);
  } catch (error) {
    console.log("MongoDB Connection Error : ", error);
  }
};

export default dbConnection;
