"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _sequelize = require("sequelize");
var _DatabaseConfig = _interopRequireDefault(require("../config/DatabaseConfig"));
var _Role = _interopRequireDefault(require("./Role"));
var _Messages = require("../utils/Messages");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var User = _DatabaseConfig["default"].define('municipality_user', {
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
        args: [1, 100],
        msg: 'Name must be between 1 and 100 characters long'
      }
    }
  },
  email: {
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
      isEmail: {
        msg: 'Must be a valid email address'
      }
    }
  },
  password: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: _Messages.requiredValidationMessage
      },
      notEmpty: {
        msg: _Messages.requiredValidationMessage
      }
    }
  },
  image: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: true
  },
  phone: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isNumeric: {
        msg: 'Phone number must contain only numbers'
      },
      len: {
        args: [11],
        msg: 'Phone number must be exactly 11 digits long'
      }
    }
  },
  designation: {
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
        args: [1, 100],
        msg: 'Designation must be between 1 and 100 characters long'
      }
    }
  },
  roleId: {
    type: _sequelize.DataTypes.INTEGER,
    allowNull: false,
    field: 'role_id',
    references: {
      model: _Role["default"],
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    validate: {
      notNull: {
        msg: _Messages.requiredValidationMessage
      },
      notEmpty: {
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
      model: User,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    validate: {
      notNull: {
        msg: 'Created by is required'
      }
    }
  },
  updatedBy: {
    type: _sequelize.DataTypes.INTEGER,
    allowNull: false,
    field: 'updated_by',
    references: {
      model: User,
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
  tableName: 'municipality_user',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
User.belongsTo(_Role["default"], {
  foreignKey: 'roleId',
  as: "UserRoleId"
});
User.belongsTo(User, {
  foreignKey: 'createdBy',
  as: "UserCreatedBy"
});
User.belongsTo(User, {
  foreignKey: 'updatedBy',
  as: "UserUpdatedBy"
});
var _default = exports["default"] = User;