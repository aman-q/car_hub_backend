import upload from "../config/multer";
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size exceeds the 5MB limit!' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ error: 'Maximum 10 files are allowed!' });
        }
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
  
  export default uploadMiddleware;