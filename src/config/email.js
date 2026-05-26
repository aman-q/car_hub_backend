import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: process.env.EMAIL_PORT === "465", // true for 465 (SSL), false for 587 (TLS)
  requireTLS: true,
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (subject, recipientEmail, body) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
};

