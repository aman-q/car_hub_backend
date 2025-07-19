import { getChannel } from '../config/rabbitmq.js';
import logger from '../utils/logger.js';

const QUEUE_NAME = 'booking_created';

export const publishBookingEvent = async (booking) => {
  try {
    const channel = getChannel();

    // Ensure the queue exists (idempotent)
    await channel.assertQueue(QUEUE_NAME, {
      durable: true, // so messages survive RabbitMQ restarts
    });

    // Send booking data as buffer
    const messageBuffer = Buffer.from(JSON.stringify({
      bookingId: booking._id,
      userId: booking.user,
      carId: booking.car,
      startDate: booking.startDate,
      endDate: booking.endDate,
      price: booking.price,
      status: booking.status,
      createdAt: booking.createdAt,
    }));

    channel.sendToQueue(QUEUE_NAME, messageBuffer, {
      persistent: true,
    });

    logger.info(`📤 Booking event published to queue "${QUEUE_NAME}"`);
  } catch (error) {
    logger.error('❌ Failed to publish booking event:', error);
  }
};
