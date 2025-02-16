"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _Messages = require("../utils/Messages");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
var AuthMiddleware = function AuthMiddleware(req, res, next) {
  //console.log("ok1")
  var authHeader = req.headers['authorization'];
  var token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
  if (!token) return res.status(401).json(_Messages.ACCESS_TOKEN_REQUIRED);
  _jsonwebtoken["default"].verify(token, ACCESS_TOKEN_SECRET_KEY, function (err, user) {
    if (err) return res.status(401).json(_Messages.ACCESS_TOKEN_REQUIRED);
    req.user = user;
    next();
  });
};
var _default = exports["default"] = AuthMiddleware;