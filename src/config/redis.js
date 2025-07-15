import Redis from "ioredis";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  logger.info("Connected to Redis for rate limiter");
});

redis.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

export default redis;
