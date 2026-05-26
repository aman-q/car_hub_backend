import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import redis from '../config/redis.js';
import { MESSAGES } from '../constants/messages.js';

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "error", message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if this token has been blacklisted (via logout)
    if (decoded.jti) {
      const isBlacklisted = await redis.get(`bl:${decoded.jti}`);
      if (isBlacklisted) {
        return res.status(401).json({ status: "error", message: MESSAGES.TOKEN_INVALIDATED });
      }
    }

    req.user = decoded._id;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ status: "error", message: "Token has expired. Please refresh your token." });
    }
    return res.status(401).json({ status: "error", message: "Token is not valid" });
  }
};

export default authMiddleware;
