import express from 'express';
import { login, register ,verifyOtp ,resendOtpController } from '../controller/user.controller.js';
import { rateLimiter } from "../middlewares/rateLimiter.js";

const userRouter= express.Router();

userRouter.post("/login",login);
userRouter.post("/register",register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp",rateLimiter("otp:", 3, 60) ,resendOtpController);

export default userRouter;