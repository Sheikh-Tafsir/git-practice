"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _AuthMiddleware = _interopRequireDefault(require("../middleware/AuthMiddleware"));
var _RoleController = _interopRequireDefault(require("../controller/RoleController"));
var _UserController = _interopRequireDefault(require("../controller/UserController"));
var _AuthController = _interopRequireDefault(require("../controller/AuthController"));
var _EventController = _interopRequireDefault(require("../controller/EventController"));
var _DocumentController = _interopRequireDefault(require("../controller/DocumentController"));
var _NoticeController = _interopRequireDefault(require("../controller/NoticeController"));
var _EmployeeController = _interopRequireDefault(require("../controller/EmployeeController"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
router.use("/roles", _AuthMiddleware["default"], _RoleController["default"]);
router.use("/auth", _AuthController["default"]);
router.use("/users", _AuthMiddleware["default"], _UserController["default"]);
router.use("/events", _EventController["default"]);
router.use("/notices", _NoticeController["default"]);
router.use("/documents", _DocumentController["default"]);
router.use("/employees", _EmployeeController["default"]);
var _default = exports["default"] = router;