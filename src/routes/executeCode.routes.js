import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controllers.js";


const router = Router()

router.post("/" , verifyJWT , executeCode)

export default router;