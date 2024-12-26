import { healthCheck } from "../controllers/healthCheck.js";
import { Router } from "express";

const router = Router()

console.log("Reached to healthCheck router")
router.route("/").get(healthCheck);

export default router