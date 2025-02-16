import { DataTypes } from 'sequelize';
import Database from '../config/DatabaseConfig';
import { IS_NUMERIC, lengthValidationMessage, requiredValidationMessage } from '../utils/Messages';

const User = Database.define('municipality_user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: requiredValidationMessage},
        notEmpty: { msg: requiredValidationMessage},
        len: {
          args: [1, 100],
          msg: lengthValidationMessage(1,100)
        },
      }
    },
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: requiredValidationMessage},
        notEmpty: { msg: requiredValidationMessage},
        isEmail: { msg: 'Must be a valid email address' },
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: requiredValidationMessage},
        notEmpty: { msg: requiredValidationMessage},
      }
    },

    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isNumeric: { msg: IS_NUMERIC },
        len: {
          args: [11],
          msg: 'Phone number must be exactly 11 digits long'
        }
      }
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },

    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        field: 'updated_at'
    }
  },
  {
    tableName: 'municipality_user',
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt',
  }
);

export default User;