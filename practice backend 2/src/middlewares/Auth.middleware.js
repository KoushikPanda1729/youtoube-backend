import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async (req, res, next) => {
  const token =
    req?.cookies?.accessToken ||
    req?.header("Authorizaton")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(400, "Unathorized access request");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(400, "user does not exists");
  }
  req.user = user;
  next();
});

export default verifyJwt;
