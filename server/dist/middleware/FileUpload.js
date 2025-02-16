"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileUpload = void 0;
var _multer = _interopRequireDefault(require("multer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var fileMaxSize = 5 * 1024 * 1024;
var FileUpload = exports.FileUpload = (0, _multer["default"])({
  // dest: 'uploads/',
  limits: {
    fileSize: fileMaxSize
  },
  fileFilter: function fileFilter(req, file, cb) {
    var allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and GIF files are allowed!'));
    }
  }
});