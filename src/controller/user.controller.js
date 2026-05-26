import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateToken, generateRefreshToken, hashToken, REFRESH_TOKEN_TTL_MS } from '../utils/jwt.js';
import { registerUser, verifyUserOtp, resendOtp, refreshTokenService, logoutService } from '../services/authService.js';
import { getProfileService, updateProfileService } from '../services/userService.js';
import { getProfileBookingsService } from '../services/bookingService.js';
import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { sendSuccess, sendError } from "../helpers/responseHelper.js";
import logger from "../utils/logger.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, MESSAGES.USER_NOT_FOUND, null, STATUS_CODES.BAD_REQUEST);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendError(res, MESSAGES.INVALID_CREDENTIALS, null, STATUS_CODES.BAD_REQUEST);
    }

    if (!user.isEmailVerified) {
      return sendError(res, MESSAGES.EMAIL_NOT_VERIFIED, null, STATUS_CODES.FORBIDDEN);
    }

    const accessToken = generateToken(user);
    const rawRefreshToken = generateRefreshToken();

    user.refreshToken = hashToken(rawRefreshToken);
    user.refreshTokenExpiry = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await user.save();

    return sendSuccess(res, MESSAGES.LOGIN_SUCCESS, {
      accessToken,
      refreshToken: rawRefreshToken,
      data: {
        email: user.email,
        firstName: user.fname,
        lastName: user.lname,
        phoneNumber: user.phonenumber,
      },
    }, STATUS_CODES.OK);
  } catch (err) {
    return sendError(res, MESSAGES.SERVER_ERROR, err.message, STATUS_CODES.SERVER_ERROR);
  }
};

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    return sendSuccess(res, MESSAGES.USER_REGISTER_SUCCESS, { user }, STATUS_CODES.CREATED);
  } catch (error) {
    const status = error.message === MESSAGES.USER_ALREADY_EXISTS
      ? STATUS_CODES.BAD_REQUEST
      : STATUS_CODES.SERVER_ERROR;
    return sendError(res, error.message, null, status);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const user = await verifyUserOtp(req.body);
    return sendSuccess(res, MESSAGES.OTP_VERIFIED_SUCCESS, { user }, STATUS_CODES.OK);
  } catch (error) {
    const knownErrors = [
      MESSAGES.USER_NOT_FOUND,
      MESSAGES.EMAIL_ALREADY_VERIFIED,
      MESSAGES.INVALID_OTP,
      MESSAGES.OTP_EXPIRED,
    ];
    const status = knownErrors.includes(error.message)
      ? STATUS_CODES.BAD_REQUEST
      : STATUS_CODES.SERVER_ERROR;
    return sendError(res, error.message, null, status);
  }
};

export const resendOtpController = async (req, res) => {
  try {
    const user = await resendOtp(req.body);
    return sendSuccess(res, MESSAGES.OTP_RESENT_SUCCESS, { user }, STATUS_CODES.OK);
  } catch (error) {
    const knownErrors = [MESSAGES.USER_NOT_FOUND, MESSAGES.EMAIL_ALREADY_VERIFIED];
    const status = knownErrors.includes(error.message)
      ? STATUS_CODES.BAD_REQUEST
      : STATUS_CODES.SERVER_ERROR;
    return sendError(res, error.message, null, status);
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshTokenService(refreshToken);
    return sendSuccess(res, MESSAGES.TOKEN_REFRESHED, tokens, STATUS_CODES.OK);
  } catch (error) {
    const status = error.message === MESSAGES.REFRESH_TOKEN_REQUIRED
      ? STATUS_CODES.BAD_REQUEST
      : STATUS_CODES.UNAUTHORIZED;
    return sendError(res, error.message, null, status);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await getProfileService(req.user);
    return sendSuccess(res, MESSAGES.PROFILE_FETCH_SUCCESS, { user }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error fetching profile:", error);
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, error.statusCode || STATUS_CODES.SERVER_ERROR);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await updateProfileService(req.user, req.body);
    return sendSuccess(res, MESSAGES.PROFILE_UPDATE_SUCCESS, { user }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error updating profile:", error);
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, error.statusCode || STATUS_CODES.SERVER_ERROR);
  }
};

export const getProfileBookings = async (req, res) => {
  try {
    const { upcoming, past } = await getProfileBookingsService(req.user);

    if (upcoming.length === 0 && past.length === 0) {
      return sendSuccess(res, MESSAGES.NO_BOOKINGS_YET, { upcoming: [], past: [] }, STATUS_CODES.OK);
    }

    return sendSuccess(res, MESSAGES.BOOKINGS_FETCH_SUCCESS, { upcoming, past }, STATUS_CODES.OK);
  } catch (error) {
    logger.error("Error fetching profile bookings:", error);
    return sendError(res, error.message || MESSAGES.SERVER_ERROR, error.message, error.statusCode || STATUS_CODES.SERVER_ERROR);
  }
};

export const logoutController = async (req, res) => {
  try {
    const accessToken = req.header("Authorization").split(" ")[1];
    const { refreshToken } = req.body;
    await logoutService(accessToken, refreshToken, req.user);
    return sendSuccess(res, MESSAGES.LOGOUT_SUCCESS, {}, STATUS_CODES.OK);
  } catch (error) {
    return sendError(res, MESSAGES.SERVER_ERROR, null, STATUS_CODES.SERVER_ERROR);
  }
};
