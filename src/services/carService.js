import Car from "../models/cars.model.js";
import mongoose from "mongoose";
import {uploadMultipleImagesToCloudinary} from '../config/cloudnaryStorage.js';

/**
 * Service to get paginated cars
 */
export const getCars = async (page, limit) => {
  const skip = (page - 1) * limit;

  const totalCars = await Car.countDocuments();

  const cars = await Car.find(
    {},
    "_id title price images company yearOfManufacture driveType description" 
  )
    .skip(skip)
    .limit(limit)
    .lean(); 
  const totalPages = Math.ceil(totalCars / limit);

  return { cars, totalPages, totalCars };
};

/**
 * Service to add a new car
 */
export const addCarService = async (userId, carData, files) => {
  const { title, description, yearOfManufacture, driveType, company } = carData;

  // Check if at least 3 images are uploaded
  if (!files || files.length < 3) {
    const error = new Error("At least 3 images are required.");
    error.statusCode = 400;
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
  });

  await newCar.save();
  return newCar;
};

/**
 * Service to remove a car
 */
export const removeCarService = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Missing or invalid ID");
    error.statusCode = 400;
    throw error;
  }

  const car = await Car.findByIdAndDelete(id);

  if (!car) {
    const error = new Error("Car not found");
    error.statusCode = 404;
    throw error;
  }

  return car;
};

/**
 * Service to update a car
 */
export const updateCarService = async (id, updateFields, files) => {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid or missing Car ID");
      error.statusCode = 400;
      throw error;
    }
  
    let updatedImages = [];
  
    if (files?.images?.length > 0) {
      updatedImages = await Promise.all(
        files.images.map((file) => uploadMultipleImagesToCloudinary(file, "collection/"))
      );
    }
  
    const updateData = {
      ...(updateFields.title && { title: updateFields.title }),
      ...(updateFields.description && { description: updateFields.description }),
      ...(updateFields.tags && { tags: updateFields.tags }),
      ...(updateFields.yearOfManufacture && { yearOfManufacture: parseInt(updateFields.yearOfManufacture, 10) }),
      ...(updateFields.company && { company: updateFields.company }),
      ...(updateFields.driveType && { driveType: updateFields.driveType }),
      ...(updatedImages.length > 0 && { images: updatedImages }),
    };
  
    if (Object.keys(updateData).length === 0) {
      const error = new Error("No fields to update");
      error.statusCode = 400;
      throw error;
    }
  
    const updatedCar = await Car.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      lean: true,
    });
  
    if (!updatedCar) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }
  
    return updatedCar;
  };
  /**
 * Service to get user car 
 */
  
  export const getUserCarsService = async (userId) => {
    const cars = await Car.find({ addedby: userId }).populate("addedby", "fname lname email");
    return cars;
  };

  export const getCarDetailService = async (id) => {
    const car = await Car.findById(id).populate("addedby", "fname lname email");
    return car;
  };