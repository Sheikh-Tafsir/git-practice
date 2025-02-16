"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorHandler = void 0;
var _Messages = require("../utils/Messages");
// errorHandler.js
var ErrorHandler = exports.ErrorHandler = function ErrorHandler(err, req, res, next) {
  //console.log('error: ' + err); 

  if (err.name === 'NotFoundError' || err.status === 404 || err.message == _Messages.notFoundMessage || err.error == _Messages.notFoundMessage) {
    return res.status(404).json({
      global: _Messages.notFoundMessage
    });
  }
  if (err.name === 'ForbiddenError' || err.status === 403) {
    return res.status(403).json({
      status: 403,
      message: 'Forbidden'
    });
  }
  if (err.errors && Array.isArray(err.errors)) {
    var formattedErrors = {};
    err.errors.forEach(function (error) {
      if (!formattedErrors[error.path]) {
        formattedErrors[error.path] = error.message;
      }
    });
    return res.status(400).json(formattedErrors);
  }
  return res.status(err.status || 500).json({
    global: err.message || 'Internal server error'
  });
};