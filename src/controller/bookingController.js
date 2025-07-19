import { createBookingService } from "../services/bookingService.js";
import { sendSuccess, sendError } from "../helpers/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import logger from "../utils/logger.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user;
    // console.log("Creating booking for user:", userId);
    // console.log("Booking data:", req.body);
    // return;

    const booking = await createBookingService(userId, req.body);

    return sendSuccess(
      res,
      MESSAGES.BOOKING_SUCCESS,
      { booking },
      STATUS_CODES.CREATED
    );
  } catch (error) {
    logger.error("Error creating booking:", error);
    const statusCode = error.statusCode || STATUS_CODES.SERVER_ERROR;
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, statusCode);
  }
};
