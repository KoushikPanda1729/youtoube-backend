import { Router } from "express";
import verifyJwt from "../middlewares/Auth.middleware.js";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";

const commentRoute = Router();

commentRoute.route("/:videoId").get(verifyJwt, getVideoComments);
commentRoute.route("/:videoId").post(verifyJwt, addComment);
commentRoute.route("/:commentId").patch(verifyJwt, updateComment);
commentRoute.route("/:commentId").delete(verifyJwt, deleteComment);

export default commentRoute;
