import { Router } from "express";
import { registerUser, loginUser, refreshAccessToken } from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";

const router = Router()

router.post("/register", upload.single("avatar"), registerUser)

router.post("/login", upload.none(), loginUser)

router.post("/refreshAccessToken", refreshAccessToken)

export default router