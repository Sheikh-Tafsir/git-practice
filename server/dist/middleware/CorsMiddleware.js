"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var cors = require('cors');
_dotenv["default"].config();
var corsOptions = {
  origin: process.env.CLIENT_PATH || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // Add the HTTP methods you need
  allowedHeaders: ["Content-Type", "Authorization"],
  // Add the headers you want to allow
  credentials: true
};
var CorsMiddleware = cors(corsOptions);
var _default = exports["default"] = CorsMiddleware;