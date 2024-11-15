import express from 'express';
import userRouter from './user.router.js';
import carRouter from './cars.route.js';

const router =express.Router();

router.use("/user",userRouter);
router.use("/cars",carRouter);



export default router;