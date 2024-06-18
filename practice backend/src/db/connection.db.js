import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const dbConnection = async () => {
  try {
    const dbObject = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`Host is : ${dbObject.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection connection error : ${error}`);
    process.exit(1);
  }
};

export default dbConnection;
