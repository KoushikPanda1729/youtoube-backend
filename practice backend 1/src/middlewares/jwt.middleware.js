import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.util.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";

export const jwtVerify = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(400, "Unathorize Access without token");
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken?._id).select(
      "-password -refreshToke"
    );
    req.user = user;
    next();
  } catch (error) {
    console.log("Error occured at jwt verify : ", error);
    throw new ApiError(400, "Unathorized Request");
  }
});
