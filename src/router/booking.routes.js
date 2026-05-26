import express from 'express';
import authMiddleware from '../middleware/authenticateToken.js';
import {
  createBooking,
  cancelBooking,
  completeBooking,
  confirmBooking,
  getUserBookings,
  getBookingById,
} from '../controller/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/new-booking', authMiddleware, createBooking);

// Must be before /:id to avoid route conflict
bookingRouter.get('/my-bookings', authMiddleware, getUserBookings);

bookingRouter.get('/:id', authMiddleware, getBookingById);
bookingRouter.patch('/:id/cancel', authMiddleware, cancelBooking);
bookingRouter.patch('/:id/complete', authMiddleware, completeBooking);
bookingRouter.patch('/:id/confirm', authMiddleware, confirmBooking);

export default bookingRouter;
