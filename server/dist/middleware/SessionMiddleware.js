"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _expressSession = _interopRequireDefault(require("express-session"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var SessionMiddleware = (0, _expressSession["default"])({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: false
  }
});
var _default = exports["default"] = SessionMiddleware;