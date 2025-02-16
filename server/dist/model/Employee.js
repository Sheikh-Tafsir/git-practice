"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _sequelize = require("sequelize");
var _DatabaseConfig = _interopRequireDefault(require("../config/DatabaseConfig"));
var _User = _interopRequireDefault(require("./User"));
var _Messages = require("../utils/Messages");
var _Utils = require("../utils/Utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var Employee = _DatabaseConfig["default"].define('municipality_employee', {
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
      notEmpty: {
        msg: _Messages.requiredValidationMessage
      },
      len: {
        args: [1, 100],
        msg: (0, _Messages.lengthValidationMessage)(null, 100)
      }
    }
  },
  post: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: _Messages.requiredValidationMessage
      },
      len: {
        args: [1, 100],
        msg: (0, _Messages.lengthValidationMessage)(null, 100)
      }
    }
  },
  description: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 300],
        msg: (0, _Messages.lengthValidationMessage)(0, 300)
      }
    }
  },
  image: {
    type: _sequelize.DataTypes.BLOB,
    allowNull: false,
    validate: {
      notNull: {
        msg: _Messages.requiredValidationMessage
      }
    }
  },
  department: {
    type: _sequelize.DataTypes.ENUM,
    values: _Utils.employeeDeptList,
    allowNull: false,
    validate: {
      notNull: {
        msg: _Messages.requiredValidationMessage
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
  tableName: 'municipality_employee',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
Employee.belongsTo(_User["default"], {
  foreignKey: 'createdBy',
  as: "EmployeeCreatedBy"
});
Employee.belongsTo(_User["default"], {
  foreignKey: 'updatedBy',
  as: "EmployeeUpdatedBy"
});
var _default = exports["default"] = Employee;