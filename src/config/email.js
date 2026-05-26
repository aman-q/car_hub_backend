import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

export const sendEmail = async (subject, recipientEmail, body) => {
  try {
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: body,
      sender: { name: 'CarHub', email: 'aman14jsr@gmail.com' },
      to: [{ email: recipientEmail }],
    });
    logger.info('Email sent successfully:', data.messageId);
    return data;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};
