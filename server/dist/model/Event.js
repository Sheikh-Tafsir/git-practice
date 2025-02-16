"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _sequelize = require("sequelize");
var _DatabaseConfig = _interopRequireDefault(require("../config/DatabaseConfig"));
var _User = _interopRequireDefault(require("./User"));
var _Messages = require("../utils/Messages");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var Event = _DatabaseConfig["default"].define('municipality_event', {
  id: {
    type: _sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false
  },
  name: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: _Messages.requiredValidationMessage
      },
      notEmpty: {
        msg: _Messages.requiredValidationMessage
      },
      len: {
        args: [1, 500],
        msg: 'Name must be between 1 and 100 characters long'
      }
    }
  },
  description: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Description must be between 1 and 1000 characters long'
      }
    }
  },
  image: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: _sequelize.DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Date is required'
      }
    }
  },
  deleted: {
    type: _sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdBy: {
    type: _sequelize.DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: _User["default"],
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    validate: {
      notNull: {
        msg: 'Added by is required'
      }
    }
  },
  updatedBy: {
    type: _sequelize.DataTypes.INTEGER,
    allowNull: false,
    field: 'updated_by',
    references: {
      model: _User["default"],
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    validate: {
      notNull: {
        msg: 'Updated by is required'
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
  tableName: 'municipality_event',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
Event.belongsTo(_User["default"], {
  foreignKey: 'createdBy',
  as: "EventCreatedBy"
});
Event.belongsTo(_User["default"], {
  foreignKey: 'updatedBy',
  as: "EventUpdatedBy"
});
var _default = exports["default"] = Event;