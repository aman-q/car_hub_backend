import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

console.log("Email Config Debug:");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("USER:", process.env.EMAIL_USER ? "SET" : "NOT SET");
console.log("PASS:", process.env.EMAIL_PASSWORD ? "SET" : "NOT SET");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: process.env.EMAIL_PORT === "465",
  requireTLS: true,
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    logger.error("Email transporter verification failed:", error);
  } else {
    logger.info("Email transporter verified successfully");
  }
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
    logger.error("Error sending email:", error.message);
    logger.error("Error details:", error);
    throw error;
  }
};

