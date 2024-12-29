import { Router } from "express";
import { registerUser } from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import { APIResponse } from "../utills/APIRespones.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";

// const test = async (req, res) => {
//     return APIResponse.success(res, "POST is working", "", 200)
// }

const router = Router()

// router.route("/test").post(test)

// router.route("/register").post(
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         }
//     ], registerUser)
// )

// router.route("/register").post(registerUser)
router.post("/register", upload.single("avatar"), registerUser)

export default router