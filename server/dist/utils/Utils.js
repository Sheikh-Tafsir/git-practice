"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paginationSize = exports.pageCount = exports.isString = exports.isNull = exports.employeeDeptList = exports.employeeDeptExists = exports.createError = exports.byteToBase64 = exports.apiResponse = void 0;
var paginationSize = exports.paginationSize = 10;
var employeeDeptList = exports.employeeDeptList = ['admin', 'officer', 'officiary', 'councillor'];
var isNull = exports.isNull = function isNull(value) {
  return !value || value == null || value == "" || value == undefined;
};
var isString = exports.isString = function isString(value) {
  return typeof errors.error === 'string';
};
var byteToBase64 = exports.byteToBase64 = function byteToBase64(imageByte) {
  var buffer = Buffer.from(imageByte);
  return "data:image/jpeg;base64," + buffer.toString('base64');
};
var employeeDeptExists = exports.employeeDeptExists = function employeeDeptExists(department) {
  return employeeDeptList.includes(department);
};
var createError = exports.createError = function createError(status, message) {
  var error = new Error(message);
  error.status = status;
  return error;
};
var pageCount = exports.pageCount = function pageCount(rowCount) {
  return Math.floor((rowCount + paginationSize - 1) / paginationSize);
};
var apiResponse = exports.apiResponse = function apiResponse(message, data) {
  return {
    message: message,
    data: data
  };
};