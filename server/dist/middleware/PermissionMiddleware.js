"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Messages = require("../utils/Messages");
var PermissionMiddleware = function PermissionMiddleware(role) {
  return function (req, res, next) {
    //console.log("ok1")    
    var user = req.user;
    if (user.role > role) {
      return res.status(401).json({
        message: _Messages.UNAUTHORIZED
      });
    }
    next();
  };
};
var _default = exports["default"] = PermissionMiddleware;