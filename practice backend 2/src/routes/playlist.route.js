import { Router } from "express";
import verifyJwt from "../middlewares/Auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const playlistRoute = Router();
playlistRoute.route("/").post(verifyJwt, createPlaylist);
playlistRoute.route("/update/:playlistId").patch(verifyJwt, updatePlaylist);
playlistRoute.route("/delete/:playlistId").delete(verifyJwt, deletePlaylist);
playlistRoute
  .route("/add-video/:playlistId/:videoId")
  .patch(verifyJwt, addVideoToPlaylist);
playlistRoute
  .route("/delete-video/:playlistId/:videoId")
  .delete(verifyJwt, removeVideoFromPlaylist);
playlistRoute
  .route("/get-playlist/:playlistId")
  .get(verifyJwt, getPlaylistById);
playlistRoute.route("/users/:userId").get(verifyJwt, getUserPlaylists);

export default playlistRoute;
