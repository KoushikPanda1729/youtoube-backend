import { Router } from "express";
import registerUserController, {
  logOutUserController,
  loginUserController,
  refreshAccessToken,
} from "../controllers/registerUser.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authLogOut } from "../middlewares/Auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
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
  registerUserController
);
userRouter.route("/login").post(loginUserController);
userRouter.route("/logout").post(authLogOut, logOutUserController);
userRouter.route("/refresh").post(refreshAccessToken);

export default userRouter;
