import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller";
import verifyJWT from "../middlewares/auth.middleware.js"


const router = Router()
router.use(verifyJWT);
routerroute('./').post(createPlaylist)

router
    .route('./:playlistId')
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist)
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);
router.route("/user/:userId/:playlistId").get(getUserPlaylists);
export default router
