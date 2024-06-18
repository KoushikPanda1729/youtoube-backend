import { Router } from "express";
import verifyJwt from "../middlewares/Auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const tweetRoute = Router();

tweetRoute.route("/create").post(verifyJwt, createTweet);
tweetRoute.route("/:userId").get(verifyJwt, getUserTweets);
tweetRoute.route("/update/:tweetId").patch(verifyJwt, updateTweet);
tweetRoute.route("/delete/:tweetId").delete(verifyJwt, deleteTweet);

export default tweetRoute;
