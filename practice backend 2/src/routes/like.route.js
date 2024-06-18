import { Router } from "express";
import verifyJwt from "../middlewares/Auth.middleware.js";
import {
    getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const likeRoute = Router();

likeRoute.route("/toggle/:videoId").post(verifyJwt, toggleVideoLike);
likeRoute.route("/toggle/:commentId").post(verifyJwt, toggleCommentLike);
likeRoute.route("/toggle/:tweetId").post(verifyJwt, toggleTweetLike);
likeRoute.route("/toggle/liked-video").get(verifyJwt, getLikedVideos);

export default likeRoute;
