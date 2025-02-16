"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var asyncHandler = function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next))["catch"](next); // Automatically passes errors to next (errorHandler)
  };
};
var _default = exports["default"] = asyncHandler;