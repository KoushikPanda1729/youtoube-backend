import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  getUserProfileDetail,
  getWatchHistory,
  loggedOutUser,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/Auth.middleware.js";

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
  registerUser
);

userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJwt, loggedOutUser);
userRouter.route("/refresh").post(refreshAccessToken);
userRouter.route("/change-password").patch(verifyJwt, changePassword);
userRouter.route("/get-user").get(verifyJwt, getCurrentUser);
userRouter.route("/update-user").patch(verifyJwt, updateAccountDetails);
userRouter
  .route("/update-avatar")
  .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
userRouter
  .route("/update-coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);

  userRouter.route("/history").get(verifyJwt, getWatchHistory);
  userRouter.route("/:userName").get(verifyJwt, getUserProfileDetail);
export default userRouter;
