import { Router } from "express";
import verifyJwt from "../middlewares/Auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRoute = Router();

subscriptionRoute.route("/:channelId").post(verifyJwt, toggleSubscription);
subscriptionRoute.route("/:channelId").get(verifyJwt, getUserChannelSubscribers);
subscriptionRoute.route("/:subscriberId").get(verifyJwt, getSubscribedChannels);
export default subscriptionRoute;
