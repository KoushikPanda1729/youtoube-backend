import mongoose from "mongoose";
import DB_NAME from "./../constant.js";

const connectDB = async () => {
  try {
    const instants = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`Host is :: ${instants.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection Error :: ", error);
    process.exit(1);
  }
};

export default connectDB;
