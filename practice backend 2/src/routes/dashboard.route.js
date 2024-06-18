import { Router } from "express";
import verifyJwt from "../middlewares/Auth.middleware.js";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";

const dashboardRoute = Router();

dashboardRoute.route("/states").get(verifyJwt, getChannelStats);
dashboardRoute.route("/chanel-video").get(verifyJwt, getChannelVideos);

export default dashboardRoute;
