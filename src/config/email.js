import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const port = Number(process.env.EMAIL_PORT);
const isSecure = port === 465; // SSL for 465, TLS for 587

logger.info(`[EMAIL] Initializing with HOST=${process.env.EMAIL_HOST}, PORT=${port}, SECURE=${isSecure}`);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: port,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: isSecure,
  requireTLS: true,
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
});

export const sendEmail = async (subject, recipientEmail, body) => {
  try {
    logger.info(`[EMAIL] Sending to ${recipientEmail}`);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`[EMAIL] Sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`[EMAIL] Failed: ${error.message}`);
    throw error;
  }
};

