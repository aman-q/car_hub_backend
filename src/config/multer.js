import multer from 'multer';
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, JPG, and PNG are allowed.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).array('images', 10); 

export default upload;


