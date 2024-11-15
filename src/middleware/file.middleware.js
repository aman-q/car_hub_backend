import upload from "../config/multer.js";
import multer from 'multer';
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return next();
    }
    if (req.files.length < 1) {
      return res.status(400).json({ message: 'At least 1 image is required for update.' });
    }
    next();
  });
};

export default uploadMiddleware;
