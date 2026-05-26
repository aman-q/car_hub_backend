import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

console.log("=== EMAIL CONFIG DEBUG ===");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("USER:", process.env.EMAIL_USER ? "SET" : "NOT SET");
console.log("PASS:", process.env.EMAIL_PASSWORD ? "SET" : "NOT SET");
console.log("========================");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: false, // port 587 uses STARTTLS, not SSL
  requireTLS: true,
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 10000, // 10 seconds
});

// Verify transporter on startup
console.log("Verifying email transporter...");
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification FAILED:", error.message);
    logger.error("Email transporter verification failed:", error.message);
  } else {
    console.log("✅ Email transporter verified successfully");
    logger.info("Email transporter verified successfully");
  }
});

export const sendEmail = async (subject, recipientEmail, body) => {
  try {
    console.log(`Sending email to ${recipientEmail}...`);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    logger.info("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    logger.error("Error sending email:", error.message);
    throw error;
  }
};

