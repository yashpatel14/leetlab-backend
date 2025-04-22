import { Router } from "express";
import { check, login, logout, register } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/check").get(verifyJWT,check)

export default router;