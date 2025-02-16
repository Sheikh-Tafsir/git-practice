"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requiredValidationMessage = exports.notFoundMessage = exports.lengthValidationMessage = exports.UNAUTHORIZED = exports.ACCESS_TOKEN_REQUIRED = void 0;
var lengthValidationMessage = exports.lengthValidationMessage = function lengthValidationMessage(min, max) {
  if (min && max) return "Should be between ".concat(min, " and ").concat(max, " characters");else if (!min && max) return "Should be less than ".concat(max, " characters");else if (min && !max) return "Should be more than ".concat(max, " characters");
};
var requiredValidationMessage = exports.requiredValidationMessage = "Required";
var notFoundMessage = exports.notFoundMessage = "Not Found";
var ACCESS_TOKEN_REQUIRED = exports.ACCESS_TOKEN_REQUIRED = 'Access Token Required';
var UNAUTHORIZED = exports.UNAUTHORIZED = "Unauthorized";