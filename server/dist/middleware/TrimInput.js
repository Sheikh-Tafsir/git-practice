"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var TrimInput = function TrimInput(req, res, next) {
  var trimAndConvert = function trimAndConvert(value) {
    if (typeof value === 'string') {
      var trimmed = value.trim();
      return trimmed === '' ? null : trimmed;
    }
    return value;
  };

  // Process `req.body`
  if (req.body && _typeof(req.body) === 'object') {
    for (var key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.body[key] = trimAndConvert(req.body[key]);
      }
    }
  }

  // Process `req.query`
  if (req.query && _typeof(req.query) === 'object') {
    for (var _key in req.query) {
      if (req.query.hasOwnProperty(_key)) {
        req.query[_key] = trimAndConvert(req.query[_key]);
      }
    }
  }

  // Process `req.params`
  if (req.params && _typeof(req.params) === 'object') {
    for (var _key2 in req.params) {
      if (req.params.hasOwnProperty(_key2)) {
        req.params[_key2] = trimAndConvert(req.params[_key2]);
      }
    }
  }
  next();
};
var _default = exports["default"] = TrimInput;