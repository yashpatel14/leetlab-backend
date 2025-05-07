import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from "../controllers/playlist.controllers.js";




const router = Router()

router.get("/" , verifyJWT , getAllListDetails);

router.get("/:playlistId" , verifyJWT , getPlayListDetails);

router.post("/create-playlist" , verifyJWT , createPlaylist);

router.post("/:playlistId/add-problem" , verifyJWT , addProblemToPlaylist);

router.delete("/:playlistId" , verifyJWT , deletePlaylist);


router.delete("/:playlistId/remove-problem" , verifyJWT , removeProblemFromPlaylist)

export default router;