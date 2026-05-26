import {
  createBookingService,
  cancelBookingService,
  completeBookingService,
  confirmBookingService,
  getUserBookingsService,
  getBookingByIdService,
} from "../services/bookingService.js";
import { sendSuccess, sendError } from "../helpers/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import logger from "../utils/logger.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await createBookingService(req.user, req.body);
    return sendSuccess(res, MESSAGES.BOOKING_SUCCESS, { booking }, STATUS_CODES.CREATED);
  } catch (error) {
    logger.error("Error creating booking:", error);
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, error.statusCode || STATUS_CODES.SERVER_ERROR);
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await cancelBookingService(req.user, req.params.id);
    return sendSuccess(res, MESSAGES.BOOKING_CANCELLED, { booking }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error cancelling booking:", error);
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, error.statusCode || STATUS_CODES.SERVER_ERROR);
  }
};

export const completeBooking = async (req, res) => {
  try {
    const booking = await completeBookingService(req.user, req.params.id);
    return sendSuccess(res, MESSAGES.BOOKING_COMPLETED, { booking }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error completing booking:", error);
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, error.statusCode || STATUS_CODES.SERVER_ERROR);
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await confirmBookingService(req.user, req.params.id);
    return sendSuccess(res, MESSAGES.BOOKING_CONFIRMED_SUCCESS, { booking }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error confirming booking:", error);
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, error.statusCode || STATUS_CODES.SERVER_ERROR);
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const bookings = await getUserBookingsService(req.user, status);
    return sendSuccess(res, MESSAGES.BOOKINGS_FETCH_SUCCESS, { bookings }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error fetching user bookings:", error);
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, error.statusCode || STATUS_CODES.SERVER_ERROR);
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await getBookingByIdService(req.user, req.params.id);
    return sendSuccess(res, MESSAGES.BOOKING_DETAIL_SUCCESS, { booking }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error fetching booking:", error);
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, error.statusCode || STATUS_CODES.SERVER_ERROR);
  }
};
