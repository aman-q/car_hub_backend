// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import logger from "../utils/logger.js";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   service: process.env.EMAIL_SERVICE, // Use EMAIL_SERVICE for service provider
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   secure: false, // Upgrade to true if using port 465 and SSL
//   requireTLS: true,
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// export const sendEmail = async (subject, recipientEmail, body) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER, // Use EMAIL_USER as sender address
//       to: recipientEmail,
//       subject,
//       html: body,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     logger.info("Email sent successfully:", info.messageId);
//     return info;
//   } catch (error) {
//     logger.error("Error sending email:", error);
//     throw error;
//   }
// };

import { Resend } from 'resend';
import logger from '../utils/logger.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (subject, recipientEmail, body) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // replace with your domain later
      to: recipientEmail,
      subject,
      html: body,
    });

    if (error) throw error;

    logger.info('Email sent successfully:', data.id);
    return data;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};