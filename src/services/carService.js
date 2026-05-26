import Car from "../models/cars.model.js";
import Booking from "../models/Booking.modal.js";
import mongoose from "mongoose";
import { uploadMultipleImagesToCloudinary } from '../config/cloudnaryStorage.js';
import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed'];

export const getCars = async (page, limit, startDate, endDate) => {
  const skip = (page - 1) * limit;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If a date range is supplied, exclude cars with any overlapping active booking
  let carFilter = {};
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start) && !isNaN(end) && end > start) {
      const bookedCarIds = await Booking.distinct('car', {
        isDeleted: false,
        status: { $in: ACTIVE_BOOKING_STATUSES },
        startDate: { $lte: end },
        endDate: { $gte: start },
      });
      if (bookedCarIds.length > 0) {
        carFilter = { _id: { $nin: bookedCarIds } };
      }
    }
  }

  // Single query to find which cars are booked right now — used for the isCurrentlyAvailable flag
  const currentlyBookedIds = await Booking.distinct('car', {
    isDeleted: false,
    status: { $in: ACTIVE_BOOKING_STATUSES },
    startDate: { $lte: today },
    endDate: { $gte: today },
  });
  const bookedNowSet = new Set(currentlyBookedIds.map(id => id.toString()));

  const totalCars = await Car.countDocuments(carFilter);
  const cars = await Car.find(
    carFilter,
    '_id title price images company yearOfManufacture driveType description'
  )
    .skip(skip)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(totalCars / limit);

  return {
    cars: cars.map(car => ({
      ...car,
      isCurrentlyAvailable: !bookedNowSet.has(car._id.toString()),
    })),
    totalPages,
    totalCars,
  };
};

/**
 * Service to add a new car
 */
export const addCarService = async (userId, carData, files) => {
  const { title, description, yearOfManufacture, driveType, company, price } = carData;

  // Check if at least 3 images are uploaded
  if (!files || files.length < 3) {
    const error = new Error(MESSAGES.AT_LEAST_THREE_IMAGES);
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  // Upload images
  const folderName = `/collection/images/`;
  const photoUrls = await uploadMultipleImagesToCloudinary(files, folderName);

  // Create new car
  const newCar = new Car({
    addedby: userId,
    title,
    description,
    images: photoUrls,
    yearOfManufacture: parseInt(yearOfManufacture, 10),
    company,
    driveType,
    price: parseFloat(price),
  });

  await newCar.save();
  return newCar;
};

/**
 * Service to remove a car
 */
export const removeCarService = async (userId, id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(MESSAGES.INVALID_ID);
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  const car = await Car.findById(id);

  if (!car) {
    const error = new Error(MESSAGES.CARS_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  if (car.addedby.toString() !== userId) {
    const error = new Error(MESSAGES.UNAUTHORIZED_CAR_ACTION);
    error.statusCode = STATUS_CODES.FORBIDDEN;
    throw error;
  }

  await car.deleteOne();
  return car;
};

/**
 * Service to update a car
 */
export const updateCarService = async (userId, id, updateFields, files) => {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error(MESSAGES.INVALID_ID);
      error.statusCode = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const existing = await Car.findById(id);
    if (!existing) {
      const error = new Error(MESSAGES.CARS_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    if (existing.addedby.toString() !== userId) {
      const error = new Error(MESSAGES.UNAUTHORIZED_CAR_ACTION);
      error.statusCode = STATUS_CODES.FORBIDDEN;
      throw error;
    }
  
    let updatedImages = [];

    if (files?.length > 0) {
      updatedImages = await uploadMultipleImagesToCloudinary(files, "collection/");
    }

    const updateData = {
      ...(updateFields.title && { title: updateFields.title }),
      ...(updateFields.description && { description: updateFields.description }),
      ...(updateFields.tags && { tags: updateFields.tags }),
      ...(updateFields.yearOfManufacture && { yearOfManufacture: parseInt(updateFields.yearOfManufacture, 10) }),
      ...(updateFields.company && { company: updateFields.company }),
      ...(updateFields.driveType && { driveType: updateFields.driveType }),
      ...(updateFields.price && { price: parseFloat(updateFields.price) }),
      ...(updatedImages.length > 0 && { images: updatedImages }),
    };
  
    if (Object.keys(updateData).length === 0) {
      const error = new Error(MESSAGES.NO_FIELDS_UPDATE);
      error.statusCode = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      lean: true,
    });

    if (!updatedCar) {
      const error = new Error(MESSAGES.CARS_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    }
  
    return updatedCar;
  };
  /**
 * Service to get user car 
 */
  
  export const getUserCarsService = async (userId) => {
    const cars = await Car.find({ addedby: userId })
      .populate('addedby', 'fname lname email')
      .lean();

    if (!cars || cars.length === 0) return cars;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentlyBookedIds = await Booking.distinct('car', {
      car: { $in: cars.map(c => c._id) },
      isDeleted: false,
      status: { $in: ACTIVE_BOOKING_STATUSES },
      startDate: { $lte: today },
      endDate: { $gte: today },
    });
    const bookedNowSet = new Set(currentlyBookedIds.map(id => id.toString()));

    return cars.map(car => ({
      ...car,
      isCurrentlyBooked: bookedNowSet.has(car._id.toString()),
    }));
  };

  export const getCarDetailService = async (id) => {
    const car = await Car.findById(id).populate('addedby', 'fname lname email');
    if (!car) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // All future + ongoing active bookings, sorted earliest first
    const activeBookings = await Booking.find(
      {
        car: id,
        isDeleted: false,
        status: { $in: ACTIVE_BOOKING_STATUSES },
        endDate: { $gte: today },
      },
      'startDate endDate status'
    )
      .sort({ startDate: 1 })
      .lean();

    const currentBooking = activeBookings.find(
      b => new Date(b.startDate) <= today && new Date(b.endDate) >= today
    );

    const isCurrentlyBooked = !!currentBooking;

    // Walk the consecutive booking chain starting from today to find the first real gap
    let nextAvailableFrom = null;
    if (isCurrentlyBooked) {
      let blockEnd = new Date(currentBooking.endDate);
      let changed = true;
      while (changed) {
        changed = false;
        for (const b of activeBookings) {
          const bStart = new Date(b.startDate);
          const dayAfterBlock = new Date(blockEnd);
          dayAfterBlock.setDate(dayAfterBlock.getDate() + 1);
          if (bStart <= dayAfterBlock && new Date(b.endDate) > blockEnd) {
            blockEnd = new Date(b.endDate);
            changed = true;
          }
        }
      }
      nextAvailableFrom = new Date(blockEnd);
      nextAvailableFrom.setDate(nextAvailableFrom.getDate() + 1);
    }

    return {
      car,
      availability: {
        isCurrentlyBooked,
        nextAvailableFrom,
        bookedPeriods: activeBookings.map(b => ({
          startDate: b.startDate,
          endDate: b.endDate,
          status: b.status,
        })),
      },
    };
  };