import redis from "../config/redis.js";
import AbuseLog from "../models/abuseLog.js";

export const rateLimiter = (keyPrefix = "rl:", limit = 5, windowSec = 60, customKeyFn) => {
  return async (req, res, next) => {
    try {
      let key;
      if (customKeyFn) {
        key = `${keyPrefix}${customKeyFn(req)}`;
      } else {
        const ip = req.ip || req.connection.remoteAddress;
        key = `${keyPrefix}${ip}`;
      }

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      const ttl = await redis.ttl(key);

      
      // We can expose either `ttl` (time left for this specific key) or a fixed window reset time (windowSec).
      // Using `ttl` gives clients accurate retry timing but exposes internal window state.
      // Using `windowSec` is simpler and hides exact implementation details.
      // Choose based on your security and transparency needs.


      //  Add rate limit headers
      res.set("X-RateLimit-Limit", limit);
      res.set("X-RateLimit-Remaining", Math.max(limit - current, 0));
      res.set("X-RateLimit-Reset", ttl);

      if (current > limit) {
        //  Log abuse to MongoDB
        await AbuseLog.create({
          ip_address: req.ip,
          route: req.originalUrl,
          method: req.method,
          exceeded_limit: current,
          allowed_limit: limit,
          window_sec: windowSec,
        });

        res.set("Retry-After", ttl);
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

// Global rate limiter (applies to all routes) with 100 requests per 60 seconds
export const globalRateLimiter = rateLimiter("gl:", 100, 3600);

// OTP rate limiter (3 requests per 5 minutes)
export const otpRateLimiter = rateLimiter("otp:", 3, 300);

// Login rate limiter (5 requests per 10 minutes)
export const loginRateLimiter = rateLimiter("login:", 5, 300);

// Register rate limiter (5 requests per 10 minutes)
export const registerRateLimiter = rateLimiter("reg:", 5, 600);
