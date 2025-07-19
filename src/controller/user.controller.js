import User from '../models/user.model.js'
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js'
import { registerUser ,verifyUserOtp ,resendOtp } from '../services/authService.js';
import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { sendSuccess, sendError } from "../helpers/responseHelper.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation check from frontend

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ messaage: "No user existed with this email!" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ messaage: "Inavlid credential!" });
        }
        // Check if user is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({ message: "Please verify your email first!" });
        }
        // Generate JWT token
        const token = generateToken(user);
        res.status(200).json({
            status: 200,
            message: "User logged in successfully",
            token,
            data: {
                email: user.email,
                firstName: user.fname,
                lastName: user.lname,
                phoneNumber: user.phonenumber,
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server Error', error: err.message });

    }

};

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return sendSuccess(
      res,
      MESSAGES.USER_REGISTER_SUCCESS,
      { user },
      STATUS_CODES.CREATED
    );
  } catch (error) {
    console.error("Error in register:", error);

    const status =
      error.message === MESSAGES.USER_ALREADY_EXISTS
        ? STATUS_CODES.BAD_REQUEST
        : STATUS_CODES.SERVER_ERROR;

    return sendError(res, error.message, null, status);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const user = await verifyUserOtp(req.body);
    return sendSuccess(
      res,
      MESSAGES.OTP_VERIFIED_SUCCESS,
      { user },
      STATUS_CODES.OK
    );
  } catch (error) {
    const knownErrors = [
      MESSAGES.USER_NOT_FOUND,
      MESSAGES.EMAIL_ALREADY_VERIFIED,
      MESSAGES.INVALID_OTP,
      MESSAGES.OTP_EXPIRED
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

    return sendSuccess(
      res,
      MESSAGES.OTP_RESENT_SUCCESS,
      { user },
      STATUS_CODES.OK
    );
  } catch (error) {
    const knownErrors = [
      MESSAGES.USER_NOT_FOUND,
      MESSAGES.EMAIL_ALREADY_VERIFIED,
    ];

    const status = knownErrors.includes(error.message)
      ? STATUS_CODES.BAD_REQUEST
      : STATUS_CODES.SERVER_ERROR;

    return sendError(res, error.message, null, status);
  }
};