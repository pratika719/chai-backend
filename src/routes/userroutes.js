import { Router } from "express";
import { changeCurrentPassword, getUserChannelProfile, getWatchHistory, refreshAccessToken, registerUser, updatAccountDetails } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser,logoutUser,refreshAccessToken} from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([{
    name:"avatar",
    maxCount:1

},
{
    name:"coverImage",
    maxCount:1

}]), registerUser);



router.route("/login").post(loginUser);


router.route("/logout").post(verifyjwt,logoutUser);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/changepassword").post(verifyjwt,changeCurrentPassword);
router.route("/current-user").get(verifyjwt,getcurrentuser)
router.route("/update-account").patch(verifyjwt,updatAccountDetails);
router.route("/avatar").patch(verifyjwt,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyjwt,upload.single("/coverImage"),updateUsercoverImage)
router.route("/c/:username").get(verifyjwt,getUserChannelProfile);
router.route("/history").get(verifyjwt,getWatchHistory)



export default router;