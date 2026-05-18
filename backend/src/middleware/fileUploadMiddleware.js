// src/middleware/fileUploadMiddleware.js
const multer = require('multer');
const path = require('path');
const { MAX_FILE_SIZE } = require('../utils/fileValidator');
const ApiResponse = require('../utils/ApiResponse');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

const uploadSingleFile = upload.single('file');
const uploadMultipleFiles = upload.array('files', 10);

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(ApiResponse.error(`File too large. Max size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json(ApiResponse.error('Too many files. Max 10 files.'));
    }
    return res.status(400).json(ApiResponse.error(err.message));
  }
  // Handle any other errors (e.g., file filter errors)
  if (err) {
    return res.status(400).json(ApiResponse.error(err.message));
  }
  next(err);
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  handleMulterError
};