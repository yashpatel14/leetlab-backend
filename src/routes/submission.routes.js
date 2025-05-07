import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from "../controllers/submission.controllers.js";



const router = Router()

router.get("/get-all-submissions" , verifyJWT , getAllSubmission);
router.get("/get-submission/:problemId" , verifyJWT , getSubmissionsForProblem)

router.get("/get-submissions-count/:problemId" , verifyJWT , getAllTheSubmissionsForProblem)

export default router;