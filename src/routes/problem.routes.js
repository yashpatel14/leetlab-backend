import { Router } from "express";
import { checkAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { createProblem } from "../controllers/problem.controllers.js";


const router = Router()

router.post("/create-problem" , verifyJWT,checkAdmin , createProblem)

export default router;