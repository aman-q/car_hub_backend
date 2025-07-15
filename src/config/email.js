import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  service: process.env.EMAIL_SERVICE, // Use EMAIL_SERVICE for service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: false, // Upgrade to true if using port 465 and SSL
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (subject, recipientEmail, body) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use EMAIL_USER as sender address
      to: recipientEmail,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
};
