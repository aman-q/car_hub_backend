import { createBookingService } from "../services/bookingService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { MESSAGES, STATUS_CODES } from "../constants/index.js";
import logger from "../utils/logger.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user;

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
