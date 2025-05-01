import { Router } from "express";
import { checkAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problem.controllers.js";


const router = Router()

router.post("/create-problem" , verifyJWT,checkAdmin , createProblem)
router.get("/get-all-problems" , verifyJWT , getAllProblems);
router.get("/get-problem/:problemId" , verifyJWT , getProblemById);
router.patch("/update-problem/:problemId" , verifyJWT , checkAdmin , updateProblem)
router.delete("/delete-problem/:problemId" , verifyJWT , checkAdmin , deleteProblem)
router.get("/get-solved-problems" , verifyJWT , getAllProblemsSolvedByUser);

export default router;