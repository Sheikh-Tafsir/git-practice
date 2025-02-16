import multer from 'multer';
import { allowedImageTypes } from '../utils/ImageUtils';
const fileMaxSize = 5 * 1024 * 1024;

export const FileUpload = multer({
    // dest: 'uploads/',
    limits: { fileSize: fileMaxSize }, 
    fileFilter: (req, file, cb) => {
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('file type not allowed!'));
      }
    },
});