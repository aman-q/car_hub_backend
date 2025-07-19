import Booking from "../models/Booking.modal.js";
import Car from "../models/cars.model.js";
import { publishBookingEvent } from "../queues/bookingQueue.js";
import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import logger from "../utils/logger.js";

export const createBookingService = async (userId, data) => {
  const {
    carId,
    startDate,
    endDate,
    pickupLocation,
    dropoffLocation,
    extras = {}
  } = data;

  try {
    // 1. Validate car exists
    const car = await Car.findById(carId);
    if (!car) {
      logger.warn(`Car not found: ${carId}`);
      const error = new Error(MESSAGES.CARS_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    // 2. Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || end <= start) {
      logger.warn(`Invalid booking dates: start=${start}, end=${end}`);
      const error = new Error("Invalid booking dates");
      error.statusCode = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    // 3. Check car availability (respect soft-deleted bookings)
    const overlappingBooking = await Booking.findOne({
      car: carId,
      isDeleted: false,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlappingBooking) {
      const error = new Error("Car is already booked for the selected dates");
      error.statusCode = STATUS_CODES.CONFLICT;
      throw error;
    }

    // 4. Price from Car model
    if (!car.pricePerDay) {
      logger.error(`Car ${carId} missing pricePerDay field`);
      const error = new Error("Car does not have pricing info");
      error.statusCode = STATUS_CODES.SERVER_ERROR;
      throw error;
    }

    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const basePrice = durationDays * car.pricePerDay;

    // 5. Extras pricing
    let extrasCost = 0;
    const allowedExtras = ['gps', 'babySeat'];
    for (const key in extras) {
      if (!allowedExtras.includes(key)) {
        const error = new Error(`Invalid extra option: ${key}`);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
      }
    }
    if (extras.gps) extrasCost += 10;
    if (extras.babySeat) extrasCost += 5;

    const totalPrice = basePrice + extrasCost;

    // 6. Create booking
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

    // 7. Publish to RabbitMQ
    await publishBookingEvent(booking);

    return booking;

  } catch (error) {
    logger.error("Booking creation failed:", error);
    throw error; // Will be handled in controller
  }
};
