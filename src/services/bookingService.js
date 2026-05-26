import Booking from "../models/Booking.modal.js";
import Car from "../models/cars.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
// import { publishBookingEvent } from "../queues/bookingQueue.js";
import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import logger from "../utils/logger.js";
import { sendEmail } from "../config/email.js";
import { bookingConfirmationTemplate, bookingCancellationTemplate, bookingCompletionTemplate } from "../utils/emailTemplates.js";
import redis from "../config/redis.js";

export const createBookingService = async (userId, data) => {
  const {
    carId,
    startDate,
    endDate,
    pickupLocation,
    dropoffLocation,
    extras = {},
  } = data;

  // Acquire a per-car distributed lock to prevent double-booking race conditions
  const lockKey = `lock:booking:${carId}`;
  const lockValue = `${userId}-${Date.now()}`;
  const acquired = await redis.set(lockKey, lockValue, 'NX', 'EX', 10);

  if (!acquired) {
    const error = new Error(MESSAGES.BOOKING_IN_PROGRESS);
    error.statusCode = STATUS_CODES.CONFLICT;
    throw error;
  }

  try {
    const car = await Car.findById(carId);
    if (!car) {
      logger.warn(`Car not found: ${carId}`);
      const error = new Error(MESSAGES.CARS_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || end <= start) {
      logger.warn(`Invalid booking dates: start=${start}, end=${end}`);
      const error = new Error(MESSAGES.INVALID_BOOKING_DATES);
      error.statusCode = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const overlappingBooking = await Booking.findOne({
      car: carId,
      isDeleted: false,
      status: { $in: ['pending', 'confirmed'] },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (overlappingBooking) {
      const error = new Error(MESSAGES.CAR_ALREADY_BOOKED);
      error.statusCode = STATUS_CODES.CONFLICT;
      throw error;
    }

    if (!car.price) {
      logger.error(`Car ${carId} missing pricePerDay field`);
      const error = new Error(MESSAGES.CAR_NO_PRICING);
      error.statusCode = STATUS_CODES.SERVER_ERROR;
      throw error;
    }

    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const basePrice = durationDays * car.price;

    let extrasCost = 0;
    const allowedExtras = ["gps", "babySeat"];
    for (const key in extras) {
      if (!allowedExtras.includes(key)) {
        const error = new Error(MESSAGES.INVALID_EXTRA_OPTION);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
      }
    }
    if (extras.gps) extrasCost += 10;
    if (extras.babySeat) extrasCost += 5;

    const totalPrice = basePrice + extrasCost;

    const booking = await Booking.create({
      user: userId,
      car: carId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      price: totalPrice,
      extras,
    });

    logger.info(`Booking created: ${booking._id}`);

    // ✅ Fetch user & send email
    const user = await User.findById(userId);

    if (user?.email) {
      const html = bookingConfirmationTemplate(user, car, booking);
      await sendEmail( "🚗 Your Booking Confirmation",user.email ,html);
      logger.info(`Confirmation email sent to ${user.email}`);
    }

    // await publishBookingEvent(booking);

    return booking;

  } catch (error) {
    logger.error("Booking creation failed:", error);
    throw error;
  } finally {
    // Release the lock only if we still own it
    const current = await redis.get(lockKey);
    if (current === lockValue) {
      await redis.del(lockKey);
    }
  }
};

export const cancelBookingService = async (userId, bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error(MESSAGES.BOOKING_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  const booking = await Booking.findById(bookingId).populate('car');
  if (!booking || booking.isDeleted) {
    const error = new Error(MESSAGES.BOOKING_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  if (booking.user.toString() !== userId) {
    const error = new Error(MESSAGES.UNAUTHORIZED_BOOKING_ACTION);
    error.statusCode = STATUS_CODES.FORBIDDEN;
    throw error;
  }

  if (booking.status === 'cancelled') {
    const error = new Error(MESSAGES.BOOKING_ALREADY_CANCELLED);
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  if (booking.status === 'completed') {
    const error = new Error(MESSAGES.BOOKING_ALREADY_COMPLETED);
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  if (new Date(booking.startDate) <= new Date()) {
    const error = new Error(MESSAGES.CANNOT_CANCEL_STARTED_BOOKING);
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  booking.status = 'cancelled';
  await booking.save();
  logger.info(`Booking cancelled: ${booking._id}`);

  const user = await User.findById(userId);
  if (user?.email) {
    const html = bookingCancellationTemplate(user, booking.car, booking);
    await sendEmail("Your Booking Has Been Cancelled - SPYNE", user.email, html);
  }

  return booking;
};

export const completeBookingService = async (userId, bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error(MESSAGES.BOOKING_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  const booking = await Booking.findById(bookingId).populate('car');
  if (!booking || booking.isDeleted) {
    const error = new Error(MESSAGES.BOOKING_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  const isBookingOwner = booking.user.toString() === userId;
  const isCarOwner = booking.car.addedby.toString() === userId;
  if (!isBookingOwner && !isCarOwner) {
    const error = new Error(MESSAGES.UNAUTHORIZED_BOOKING_ACTION);
    error.statusCode = STATUS_CODES.FORBIDDEN;
    throw error;
  }

  if (booking.status !== 'confirmed') {
    const error = new Error(MESSAGES.BOOKING_MUST_BE_CONFIRMED);
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  if (new Date(booking.startDate) > new Date()) {
    const error = new Error(MESSAGES.CANNOT_COMPLETE_FUTURE_BOOKING);
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  booking.status = 'completed';
  await booking.save();
  logger.info(`Booking completed: ${booking._id}`);

  const user = await User.findById(booking.user);
  if (user?.email) {
    const html = bookingCompletionTemplate(user, booking.car, booking);
    await sendEmail("Your Rental is Complete - SPYNE", user.email, html);
  }

  return booking;
};

export const confirmBookingService = async (userId, bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error(MESSAGES.BOOKING_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  const booking = await Booking.findById(bookingId).populate('car');
  if (!booking || booking.isDeleted) {
    const error = new Error(MESSAGES.BOOKING_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  if (booking.car.addedby.toString() !== userId) {
    const error = new Error(MESSAGES.UNAUTHORIZED_BOOKING_ACTION);
    error.statusCode = STATUS_CODES.FORBIDDEN;
    throw error;
  }

  if (booking.status !== 'pending') {
    const error = new Error(MESSAGES.BOOKING_MUST_BE_PENDING);
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  booking.status = 'confirmed';
  await booking.save();
  logger.info(`Booking confirmed: ${booking._id}`);

  return booking;
};

export const getUserBookingsService = async (userId, status) => {
  const filter = { user: userId, isDeleted: false };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate('car', 'title company price images')
    .sort({ createdAt: -1 })
    .lean();

  return bookings;
};

export const getProfileBookingsService = async (userId) => {
  const today = new Date();

  const [upcoming, past] = await Promise.all([
    // Upcoming: active or not-yet-started pending/confirmed bookings
    Booking.find({
      user: userId,
      isDeleted: false,
      status: { $in: ['pending', 'confirmed'] },
      endDate: { $gte: today },
    })
      .populate('car', 'title company price images')
      .sort({ startDate: 1 })
      .lean(),

    // Past: completed/cancelled, or expired pending/confirmed
    Booking.find({
      user: userId,
      isDeleted: false,
      $or: [
        { status: { $in: ['cancelled', 'completed'] } },
        { status: { $in: ['pending', 'confirmed'] }, endDate: { $lt: today } },
      ],
    })
      .populate('car', 'title company price images')
      .sort({ startDate: -1 })
      .lean(),
  ]);

  return { upcoming, past };
};

export const getBookingByIdService = async (userId, bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error(MESSAGES.BOOKING_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  const booking = await Booking.findById(bookingId)
    .populate('car', 'title company price images addedby')
    .populate('user', 'fname lname email')
    .lean();

  if (!booking || booking.isDeleted) {
    const error = new Error(MESSAGES.BOOKING_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  const isBookingOwner = booking.user._id.toString() === userId;
  const isCarOwner = booking.car.addedby.toString() === userId;
  if (!isBookingOwner && !isCarOwner) {
    const error = new Error(MESSAGES.UNAUTHORIZED_BOOKING_ACTION);
    error.statusCode = STATUS_CODES.FORBIDDEN;
    throw error;
  }

  return booking;
};
