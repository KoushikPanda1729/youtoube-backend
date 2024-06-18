import mongoose from "mongoose";
import DB_NAME from "../constant.js";

const connectDB = async () => {
  try {
    const dbConnectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(dbConnectionInstance.connection.host);
  } catch (error) {
    console.log(`Error occured at mongodb connection ${error}`);
    process.exit(1);
  }
};

export default connectDB;
