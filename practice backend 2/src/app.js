import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.urlencoded({
    limit: "20kb",
    extended: true,
  })
);
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import tweetRoute from "./routes/tweet.route.js";
import commentRoute from "./routes/comment.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import likeRoute from "./routes/like.route.js";
import playlistRoute from "./routes/playlist.route.js";
import subscriptionRoute from "./routes/subcription.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/like", likeRoute);
app.use("/api/v1/playlist", playlistRoute);
app.use("/api/v1/subscriber", subscriptionRoute);

export default app;
