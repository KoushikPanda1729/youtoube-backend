import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import verifyJwt from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = Router();

videoRouter
  .route("/")
  .get(getAllVideos)
  .post(
    verifyJwt,
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

videoRouter.route("/:videoId").get(verifyJwt, getVideoById);
videoRouter
  .route("/:videoId")
  .post(verifyJwt, upload.single("thumbnail"), updateVideo);

videoRouter.route("/:videoId").delete(verifyJwt, deleteVideo);
videoRouter.route("/toggle/:videoId").patch(verifyJwt, togglePublishStatus);
export default videoRouter;
