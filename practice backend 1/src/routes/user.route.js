import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { jwtVerify } from "../middlewares/jwt.middleware.js";

const userRoute = Router();

userRoute.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
userRoute.route("/login").post(loginUser);
userRoute.route("/logout").post(jwtVerify, logoutUser);

export default userRoute;
