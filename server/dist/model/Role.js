"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _sequelize = require("sequelize");
var _DatabaseConfig = _interopRequireDefault(require("../config/DatabaseConfig"));
var _Messages = require("../utils/Messages");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var Role = _DatabaseConfig["default"].define('municipality_role', {
  id: {
    type: _sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: _Messages.requiredValidationMessage
      },
      notEmpty: {
        msg: _Messages.requiredValidationMessage
      },
      len: {
        args: [1, 100],
        msg: 'Name must be between 1 and 100 characters long'
      }
    }
  },
  createdAt: {
    type: _sequelize.DataTypes.DATE,
    allowNull: false,
    defaultValue: _sequelize.DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: _sequelize.DataTypes.DATE,
    allowNull: false,
    defaultValue: _sequelize.DataTypes.NOW,
    onUpdate: _sequelize.DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'municipality_role',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
var _default = exports["default"] = Role;