import User from "../models/user.model.js";
import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";

export const getProfileService = async (userId) => {
  const user = await User.findById(userId)
    .select('-password -otp -otpExpiry -refreshToken -refreshTokenExpiry')
    .lean();

  if (!user) {
    const error = new Error(MESSAGES.USER_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  return user;
};

export const updateProfileService = async (userId, updateData) => {
  const { fname, lname, phonenumber } = updateData;

  const update = {};
  if (fname) update.fname = fname;
  if (lname) update.lname = lname;
  if (phonenumber) {
    const taken = await User.findOne({ phonenumber, _id: { $ne: userId } });
    if (taken) {
      const error = new Error(MESSAGES.PHONE_ALREADY_IN_USE);
      error.statusCode = STATUS_CODES.CONFLICT;
      throw error;
    }
    update.phonenumber = phonenumber;
  }

  if (Object.keys(update).length === 0) {
    const error = new Error(MESSAGES.NO_FIELDS_UPDATE);
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  const user = await User.findByIdAndUpdate(userId, update, { new: true })
    .select('-password -otp -otpExpiry -refreshToken -refreshTokenExpiry')
    .lean();

  if (!user) {
    const error = new Error(MESSAGES.USER_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  return user;
};
