import express from 'express';
import { login, register ,verifyOtp ,resendOtpController } from '../controller/user.controller.js';
import { otpRateLimiter, loginRateLimiter, registerRateLimiter } from "../middleware/rateLimiter.js";


const userRouter= express.Router();

userRouter.post("/login",loginRateLimiter,login);
userRouter.post("/register",registerRateLimiter,register);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-otp", otpRateLimiter, resendOtpController);

export default userRouter;