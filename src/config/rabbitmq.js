import amqp from 'amqplib';
import logger from '../utils/logger.js';

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    logger.info('🐇 Connected to RabbitMQ');
  } catch (error) {
    logger.error('❌ Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

export const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  return channel;
};
