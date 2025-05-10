import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from "../controllers/playlist.controllers.js";




const router = Router()

router.get("/" , verifyJWT , getAllListDetails);

router.get("/:playListId" , verifyJWT , getPlayListDetails);

router.post("/create-playlist" , verifyJWT , createPlaylist);

router.post("/:playListId/add-problem" , verifyJWT , addProblemToPlaylist);

router.delete("/:playListId" , verifyJWT , deletePlaylist);


router.delete("/:playListId/remove-problem" , verifyJWT , removeProblemFromPlaylist)

export default router;