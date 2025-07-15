import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Use REDIS_URL (e.g., from Railway) if set, otherwise fallback to local Redis
let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  });
}

redis.on("connect", () => {
  console.log("Connected to  for rate limiter");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export const rateLimiter = (keyPrefix = "rl:", limit = 3, windowSec = 60) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const key = `${keyPrefix}${ip}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      if (current > limit) {
        const ttl = await redis.ttl(key);
        return res.status(429).json({
          success: false,
          message: `Too many requests. Please try again in ${ttl} seconds.`,
        });
      }

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
};
