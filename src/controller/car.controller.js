import { getCars, addCarService, removeCarService ,updateCarService,getUserCarsService,getCarDetailService, } from "../services/carService.js";
import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { sendSuccess, sendError } from "../helpers/responseHelper.js";

export const getallcars = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const { cars, totalPages, totalCars } = await getCars(page, limit);

    if (!cars || cars.length === 0) {
      return sendError(res, MESSAGES.CARS_NOT_FOUND, null, STATUS_CODES.NOT_FOUND);
    }

    return sendSuccess(res, MESSAGES.CARS_FETCH_SUCCESS, {
      cars,
      totalPages,
      currentPage: page,
      totalCars,
    }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error fetching cars:", error);
    return sendError(res, MESSAGES.SERVER_ERROR, error.message, STATUS_CODES.SERVER_ERROR);
  }
};

export const addcar = async (req, res) => {
  try {
    const userId = req.user;

    const newCar = await addCarService(userId, req.body, req.files);

    return sendSuccess(res, MESSAGES.CAR_ADD_SUCCESS, { car: newCar }, STATUS_CODES.CREATED);
  } catch (error) {
    logger.error("Error adding car:", error);
    const statusCode = error.statusCode || STATUS_CODES.SERVER_ERROR;
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, statusCode);
  }
};

export const removecar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await removeCarService(id);

    return sendSuccess(res, MESSAGES.CAR_DELETE_SUCCESS, { car }, STATUS_CODES.OK);
  } catch (error) {
    console.logger("Error removing car:", error);
    const statusCode = error.statusCode || STATUS_CODES.SERVER_ERROR;
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, statusCode);
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCar = await updateCarService(id, req.body, req.files);

    return sendSuccess(res, MESSAGES.CAR_UPDATE_SUCCESS, { car: updatedCar }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error updating car:", error);
    const statusCode = error.statusCode || STATUS_CODES.SERVER_ERROR;
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, statusCode);
  }
};

export const usercar = async (req, res) => {
  try {
    const userId = req.user;

    const cars = await getUserCarsService(userId);

    if (!cars || cars.length === 0) {
      return sendError(res, MESSAGES.CARS_NOT_FOUND, null, STATUS_CODES.NOT_FOUND);
    }

    return sendSuccess(res, MESSAGES.USER_CARS, { cars }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error fetching user cars:", error);
    return sendError(res, MESSAGES.SERVER_ERROR, error.message, STATUS_CODES.SERVER_ERROR);
  }
};

export const singlecardeatil = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await getCarDetailService(id);

    if (!car) {
      return sendError(res, MESSAGES.CAR_NOT_FOUND, null, STATUS_CODES.NOT_FOUND);
    }

    return sendSuccess(res, MESSAGES.CAR_DETAIL_SUCCESS, { car }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error fetching car detail:", error);
    return sendError(res, MESSAGES.SERVER_ERROR, error.message, STATUS_CODES.SERVER_ERROR);
  }
};