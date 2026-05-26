import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

logger.info("EMAIL CONFIG: HOST=" + process.env.EMAIL_HOST);
logger.info("EMAIL CONFIG: PORT=" + process.env.EMAIL_PORT);
logger.info("EMAIL CONFIG: USER=" + (process.env.EMAIL_USER ? "SET" : "NOT SET"));
logger.info("EMAIL CONFIG: PASS=" + (process.env.EMAIL_PASSWORD ? "SET" : "NOT SET"));

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: false,
  requireTLS: true,
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

// Verify transporter on startup
logger.info("Verifying email transporter...");
transporter.verify((error, success) => {
  if (error) {
    logger.error("Email transporter verification FAILED: " + error.message);
  } else {
    logger.info("Email transporter verified successfully");
  }
});

export const sendEmail = async (subject, recipientEmail, body) => {
  try {
    logger.info("Attempting to send email to: " + recipientEmail);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully: " + info.messageId);
    return info;
  } catch (error) {
    logger.error("Error sending email: " + error.message);
    logger.error("Error code: " + error.code);
    logger.error("Error details: " + JSON.stringify(error));
    throw error;
  }
};

