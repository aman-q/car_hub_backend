import express from 'express';
import {
  login, register, verifyOtp, resendOtpController,
  refreshTokenController, logoutController,
  getProfile, updateProfile, getProfileBookings,
} from '../controller/user.controller.js';
import { otpRateLimiter, loginRateLimiter, registerRateLimiter } from "../middleware/rateLimiter.js";
import authMiddleware from '../middleware/authenticateToken.js';

const userRouter = express.Router();

// Auth
userRouter.post("/login", loginRateLimiter, login);
userRouter.post("/register", registerRateLimiter, register);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-otp", otpRateLimiter, resendOtpController);
userRouter.post("/refresh-token", refreshTokenController);
userRouter.post("/logout", authMiddleware, logoutController);

// Profile — /profile/me/bookings must be registered before /profile/me to avoid :wildcard conflict
userRouter.get("/profile/me/bookings", authMiddleware, getProfileBookings);
userRouter.get("/profile/me", authMiddleware, getProfile);
userRouter.patch("/profile/me", authMiddleware, updateProfile);

export default userRouter;
