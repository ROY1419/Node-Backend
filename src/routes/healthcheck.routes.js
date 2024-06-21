import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware";


const router = Router()
router.use(verifyJWT)

router.route("/health-check").get(healthCheck)

export default router