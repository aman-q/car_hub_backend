import express from 'express';
import authMiddleware from '../middleware/authenticateToken.js';
import { createBooking } from '../controller/bookingController.js';

const bookingRouter = express.Router();

// Create a new booking
bookingRouter.post('/new-booking', authMiddleware, createBooking);

export default bookingRouter;

