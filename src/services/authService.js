import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { otpVerificationTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../config/email.js";
import { MESSAGES } from "../constants/messages.js";

export const registerUser = async (userData) => {
  const { email, password, fname, lname, phonenumber } = userData;

  const existingUser = await User.findOne({
    $or: [{ email: email }, { phonenumber: phonenumber }],
  });

  if (existingUser) {
    throw new Error(MESSAGES.USER_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000);

  const newUser = new User({
    fname,
    lname,
    email,
    phonenumber,
    password: hashedPassword,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000, // valid for 10 min
  });

  await newUser.save();

  const emailBody = otpVerificationTemplate(fname, otp);

  await sendEmail("Verify Your Email - OTP", email, emailBody);

  const { password: _, otp: __, otpExpiry: ___, ...userWithoutSensitive } = newUser.toObject();
  return userWithoutSensitive;
};


export const verifyUserOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }

  if (user.isEmailVerified) {
    throw new Error(MESSAGES.EMAIL_ALREADY_VERIFIED);
  }

  if (!user.otp || !user.otpExpiry || user.otp !== Number(otp)) {
    throw new Error(MESSAGES.INVALID_OTP);
  }

  if (user.otpExpiry < Date.now()) {
    throw new Error(MESSAGES.OTP_EXPIRED);
  }

  // Mark as verified
  user.isEmailVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  const { password, otp: _, otpExpiry: __, ...safeUser } = user.toObject();
  return safeUser;
};

export const resendOtp = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }

  if (user.isEmailVerified) {
    throw new Error(MESSAGES.EMAIL_ALREADY_VERIFIED);
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const emailBody = otpVerificationTemplate(user.fname, otp);

  await sendEmail("Resend OTP - Verify Your Email", email, emailBody);

  const { password, otp: _, otpExpiry: __, ...safeUser } = user.toObject();
  return safeUser;
};
