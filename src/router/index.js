import express from 'express';
import userRouter from './user.router.js';
import carRouter from './cars.route.js';
import bookingRouter from './booking.routes.js'; 

const router =express.Router();

router.use("/user",userRouter);
router.use("/cars",carRouter);
router.use("/booking", bookingRouter); // Add booking routes


export default router;