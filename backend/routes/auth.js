const router = require("express").Router();
const { register, login , verifyOtp , resendOtp , getProfile} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp); 
router.post("/resend-otp", resendOtp);
router.get("/profile", authMiddleware , getProfile);



module.exports = router;
