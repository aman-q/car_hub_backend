import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

export const generateToken = (user) => {
  const jti = crypto.randomBytes(16).toString('hex');
  return jwt.sign({ _id: user._id, jti }, secret, { expiresIn: '15m' });
};

// Returns a raw token (sent to client) — store the hash, never the raw value
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
